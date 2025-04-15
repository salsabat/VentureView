export default function UploadCSV({ userId, onUpload }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontWeight: "bold" }}>Upload CSV:</label>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}
