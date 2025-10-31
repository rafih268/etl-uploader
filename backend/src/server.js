import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const PYTHON_EXEC = process.env.PYTHON_EXEC || "python";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.join(dirname, 'uploads');
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_ROOT);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('ETL backend request is working');
});

app.post('/api/upload', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;
    const uploader = req.body.uploader || 'anonymous';

    const inserted = [];
    for (const f of files) {
      const ext = path.extname(f.originalname).toLowerCase().replace('.', '');
      const r = await pool.query(
        `
          INSERT INTO uploads (filename, original_name, file_type, path, uploader)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [f.filename, f.originalname, ext, f.path, uploader]
      );
      inserted.push(r.rows[0]);
    }

    res.json({
      ok: true,
      uploaded: inserted
    });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

app.get('/api/catalogue', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM uploads ORDER BY uploaded_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/etl/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM uploads WHERE id=$1', [id]);
    if (response.rowCount === 0) return res.status(404).json({ error: 'File not found' });

    const upload = response.rows[0];
    const filePath = upload.path;

    console.log(`Initiating ETL for ${filePath}`);

    res.json({
      message: `ETL triggered for file id ${id}`,
      file: filePath
    });

    const python = spawn(PYTHON_EXEC, ["../etl/etl_runner.py", filePath, id]);

    python.stdout.on("data", (data) => {
      console.log(`[ETL STDOUT]: ${data}`);
    });

    python.stderr.on("data", (data) => {
      console.log(`[ETL STDERR]: ${data}`);
    });

    python.on("close", async (code) => {
      console.log(`ETL process for ${id} finished with code ${code}`);

      const newStatus = code === 0 ? "processed" : "failed";
      await pool.query("UPDATE uploads SET status=$1 WHERE id=$2", [newStatus, id]);
      console.log(`File ${id} status updated to '${newStatus}'`);
    }); 
  } catch (err) {
    console.error('ETL API error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));