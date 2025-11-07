import os
import sys
from transformers.tif_transformer import import_to_postgis, get_tif_metadata

def run_etl(file_path):
  _, ext = os.path.splitext(file_path)
  ext = ext.lower().strip(".")

  if ext == "tif":
    print(get_tif_metadata(file_path))
    return import_to_postgis(file_path)
  else:
    raise ValueError(f"Unsupported file type: {ext}")

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python etl_runner.py <path_to_file> <file_id>")
    sys.exit(1)

  file_path = sys.argv[1]

  print(f"Running ETL for {file_path}")

  try:
    run_etl(file_path)
    print("ETL completed successfully.")
  except Exception as e:
    print(f"ETL failed: {e}")