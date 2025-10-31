from netCDF4 import Dataset
import psycopg2
import json
import os
from config import DB_URL

def process_netcdf(file_path, file_id):
  print(f"Processing NetCDF: {file_path}")
  ds = Dataset(file_path, 'r')

  variables = list(ds.variables.keys())
  conn = psycopg2.connect(DB_URL)
  cur = conn.cursor()

  for var_name in variables:
    var_data = ds.variables[var_name][:]
    cur.execute(
      "UPDATE uploads SET details=%s, status=%s WHERE id=%s",
      (json.dumps({'variable': var_name, 'shape': str(var_data.shape)}),
       "processed", file_id)
    )

  conn.commit()
  cur.close()
  conn.close()

  print(f"Extracted {len(variables)} variables from {file_path}")