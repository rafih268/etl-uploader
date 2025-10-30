import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: 'postgresql://etl_user:etl_pass@localhost:5432/etl_db',
});
