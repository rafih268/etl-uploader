import React, { useState } from "react";

export default function Upload() {

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function addToState(e) {
    setFiles(Array.from(e.target.files));
  }

  async function upload() {
    if (!files.length) return alert("Please select files to upload");
    const fd = new FormData();
    files.forEach((file) => fd.append("files", file));
    fd.append("uploader", "frontend-user");

    setStatus("Uploading...");
    setLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });

      const json = await res.json();
      if (json.ok) {
        setStatus(`Uploaded ${json.uploaded.length} file(s) successfully!`);
        setFiles([]);
      } else {
        setStatus(`Upload failed: ${json.error}`);
      }
    } catch (err) {
      setStatus(`Upload error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Upload Geospatial Files</h2>

      <p>
        Supported formats: <b>.nc</b> (NetCDF), <b>.tif</b> (GeoTIFF), <b>.shp / .shx / .dbf</b> (Shapefiles)
      </p>

      <input
        type="file"
        multiple
        onChange={addToState}
        style={{ marginBottom: 12 }}
      />

      <button onClick={upload} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>

      <div style={{ marginTop: 10, color: "#7820ddff"}}>{status}</div>

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