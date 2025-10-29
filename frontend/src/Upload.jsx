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

      <h3 style={{ marginTop: 20 }}>Uploaded Files</h3>

      <table
        border={1}
        cellPadding={6}
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: 10,
          fontSize: 14,
        }}
      >
        <thread style={{ background: "#f0f0f038" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thread>
        <tbody>
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#666666ff" }}>
                No uploads yet
              </td>
            </tr>
        </tbody>
      </table>
      
    </div>
  );
}