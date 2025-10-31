import os

DB_URL = os.getenv("DATABASE_URL", "postgresql://etl_user:etl_pass@localhost:5432/etl_db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "../backend/src/uploads")