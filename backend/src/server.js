import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { fileURLToPath } from 'url';

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
      message: 'File has been uploaded',
      uploaded: inserted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));