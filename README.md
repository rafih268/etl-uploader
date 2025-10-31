# ETL Uploader

**NOTE:** Implementation for shapefile related tasks will be added soon.

An application for uploading and processing geospatial datasets, inlucding NetCDF (.nc), GeoTIFF (.tif) and Shapefiles (.shp,.shx,.dbf, etc.) through a web interface.

The app supports ETL (Extract, Transform, Load) workflows with automated data loading into a PostgreSQL along with PostGIS database.

---

## Features
- Upload multiple geospatial files via browser UI.
- Automatically detect file type (.nc, .tif, .shp, etc.)
- Store uploads in filesystem and metadata in PostgreSQL.
- Trigger ETL pipeline from frontend.
- Transform and load data into PostGIS.
- View dynamic file catalogue and ETL statuses.

## Tech Stack

### Frontend
- React

### Backend
- Node.js
- Multer for file uploads
- PostgreSQL client (`pg`)
- Child process (`spawn`) to run ETL scripts

## Project Setup

After cloning the repo, run `npm install` to get the necessary dependencies in the root of the backend and frontend folder.

### PostgreSQL + PostGIS setup

Use docker compose to initiate the docker container in order to use PostgreSQL. Click [here](https://www.docker.com/get-started/) if you do not have docker installed.

Run the following commands to start psql:
```bash
docker compose up -d
docker exec -it etl_postgis psql -U etl_user -d etl_db
```

Enable PostGIS with the following:
```bash
SELECT PostGIS_Full_Version();
```

Create the `uploads` table:
```bash
CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  filename TEXT,
  path TEXT NOT NULL,
  original_name TEXT,
  file_type TEXT,
  uploader TEXT,
  details JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'uploaded'
);
```

### Backend setup

Make sure you have Node.js installed.

After running `npm install` in the root directory of `backend`, create a `.env` file with the following content:
```bash
DATABASE_URL=postgresql://etl_user:etl_pass@localhost:5432/etl_db
PYTHON_EXEC=<path to your venv in your etl folder>
PORT=4000
```

Run the backend:
```bash
npm run dev
```

### Frontend setup

After running `npm install` in the root of `frontend`, do `npm run dev` to initiate the user interface.

### ETL Environment Setup

Move to the `etl` folder and initiate a python virtual environment:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install all the necessary modules:
```bash
pip install -r requirements.txt
```

Now you should be able to start using the app, upload files and visualise your uploaded files through a dynamic catalogue.

## Licence
> MIT Licence