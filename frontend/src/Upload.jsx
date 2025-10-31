import React, { useState } from "react";

export default function Upload() {

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalogue, setCatalogue] = useState([]);

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

  async function fetchCatalogue() {
    setLoading(true);
    const response = await fetch("/api/catalogue");
    const jsonResponse = await response.json();
    setCatalogue(jsonResponse);
    setLoading(false);
  }

  async function runETL(id) {
    try {
      setStatus(`Running ETL for file ID: ${id}`);
      const response = await fetch(`/api/etl/${id}`, { method: "POST" });
      const jsonResponse = await response.json();

      if (!jsonResponse.error) {
        setStatus(`ETL complete for file ${id}`);
        fetchCatalogue;
      } else {
        setStatus(`ETL failed for file ${id}`);
      }
    } catch (err) {
      setStatus(`Running ETL failed: ${err.message}`);
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
      <button onClick={fetchCatalogue} style={{ marginLeft: 8 }}>
        Refresh Catalogue
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
        <thead style={{ background: "#f0f0f038" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogue.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.original_name}</td>
              <td>{c.file_type}</td>
              <td>{c.status}</td>
              <td>{new Date(c.uploaded_at).toLocaleString()}</td>
              <td>
                <button onClick={() => runETL(c.id)}>Run ETL</button>
              </td>
            </tr>
          ))}
          {catalogue.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#666666ff" }}>
                No uploads yet
              </td>
            </tr>
          )}  
        </tbody>
      </table>
      
    </div>
  );
}