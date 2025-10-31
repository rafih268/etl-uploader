import rasterio
import psycopg2
import json
from config import DB_URL

def process_tif(file_path, file_id):
  print(f"Processing TIF: {file_path}")
  with rasterio.open(file_path) as src:
    meta = src.meta
    width, height = src.width, src.height
    crs = src.crs.to_string()

  conn = psycopg2.connect(DB_URL)
  cur = conn.cursor()

  cur.execute(
    "UPDATE uploads SET details=%s, status=%s WHERE id=%s",
    (json.dumps({'crs': crs, 'width': width, 'height': height}), "processed", file_id)
  )

  conn.commit()
  cur.close()
  conn.close()

  print(f"Stored raster metadata for {file_path}")