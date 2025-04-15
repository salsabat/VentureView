import { useState, useEffect } from "react";
import Login from "./pages/Login";
import UploadCSV from "./components/UploadCSV";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    if (stored) setUserId(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUserId(null);
  };

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={handleLogout}>Logout</button>

      <UploadCSV
        userId={userId}
        onUpload={(info) => console.log("Uploaded:", info)}
      />
    </div>
  );
}

export default App;
