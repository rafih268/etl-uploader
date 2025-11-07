import rasterio
import subprocess
import shutil
from urllib.parse import urlparse
from pathlib import Path
from config import DB_URL, R2PGSQL_PATH

url = urlparse(DB_URL)

PG_HOST = url.hostname
PG_PORT = str(url.port)
PG_USER = url.username
PG_DB = url.path.lstrip("/")
PG_SCHEMA = "public"
PG_TABLE = "raster_data"
SRID = "4326"

def find_raster2pgsql():
  if R2PGSQL_PATH and Path(R2PGSQL_PATH).exists():
    return R2PGSQL_PATH
  
  if shutil.which("raster2pgsql"):
    return "raster2pgsql"
  
  raise FileNotFoundError("""Could not find raster2pgsql.
                          Please install PostGIS or set R2PGSQL_PATH env variable.""")

def get_tif_metadata(file_path):
  with rasterio.open(file_path) as src:
    return {
      "crs": src.crs.to_string(),
      "width": src.width,
      "height": src.height,
      "count": src.count,
      "nodata": src.nodata,
      "dtype": src.dtypes[0]
    }

def import_to_postgis(file_path):
  raster_loader = find_raster2pgsql()

  raster2pgsql_cmd = [raster_loader, "-s", SRID, "-I", "-C", "-M", file_path,
                      f"{PG_SCHEMA}.{PG_TABLE}"]

  psql_cmd = ["psql", "-U", PG_USER, "-d", PG_DB, "-p", str(PG_PORT)]
  
  raster_proc = subprocess.Popen(raster2pgsql_cmd, stdout=subprocess.PIPE)
  psql_proc = subprocess.Popen(psql_cmd, stdin=raster_proc.stdout)
  psql_proc.communicate()