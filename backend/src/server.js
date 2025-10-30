import express from 'express';
import dotenv from 'dotenv';
import { pool } from './db.js';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ETL backend request is working');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));