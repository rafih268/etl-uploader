import os
import sys
import psycopg2
from transformers.shp_transformer import process_shapefile
from transformers.tif_transformer import process_tif
from transformers.netcdf_transformer import process_netcdf
from config import DB_URL, UPLOAD_DIR

def get_db_connection():
    return psycopg2.connect(DB_URL)

def run_etl(file_path, file_id):
    _, ext = os.path.splitext(file_path)
    ext = ext.lower().strip(".")

    if ext == "nc":
        return process_netcdf(file_path, file_id)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python etl_runner.py <path_to_file> <file_id>")
        sys.exit(1)

    file_path = sys.argv[1]
    file_id = int(sys.argv[2])

    print(f"Running ETL for {file_path}")

    conn = get_db_connection()
    try:
        run_etl(file_path, file_id)
        conn.commit()
        print("ETL completed successfully.")
    except Exception as e:
        conn.rollback()
        print(f"ETL failed: {e}")
    finally:
        conn.close()