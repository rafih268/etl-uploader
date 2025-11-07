from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/raster_db")
R2PGSQL_PATH = os.getenv("RASTER2PGSQL_PATH", "C:/Program Files/PostgreSQL/18/bin/raster2pgsql.exe")