import React from "react";

export default function Upload() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Upload Geospatial Files</h2>

      <p>
        Supported formats: <b>.nc</b> (NetCDF), <b>.tif</b> (GeoTIFF), <b>.shp / .shx / .dbf</b> (Shapefiles)
      </p>

      <input
        type="file"
        multiple
        style={{ marginBottom: 12 }}
      />

      <button>Upload</button>
    </div>
  );
}