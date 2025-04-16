import { useState, useRef } from "react";
import "./UploadCSV.css";

export default function UploadCSV({ userId, onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        alert(`Upload successful!`);
        onUpload && onUpload(data);
        setFile(null);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-header">
        <h3>Upload Data</h3>
      </div>
      <p className="upload-description">
        Upload your CSV file containing time series data to generate forecasts.
      </p>

      <div className="upload-input-container" onClick={handleUploadClick}>
        <div className="upload-icon">📁</div>
        <label className="upload-label">
          {file ? file.name : "Choose a CSV file or drag & drop"}
        </label>
        <input
          ref={fileInputRef}
          className="upload-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {file && (
        <div className="file-info">
          <span className="file-name">{file.name}</span>
        </div>
      )}

      {file && (
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      )}
    </div>
  );
}
