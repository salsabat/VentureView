import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import UploadCSV from "./components/UploadCSV";
import ForecastInput from "./components/ForecastInput";
import Results from "./pages/Results";

function Dashboard({ userId, onLogout }) {
  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={onLogout}>Logout</button>
      <UploadCSV
        userId={userId}
        onUpload={(info) => console.log("Uploaded:", info)}
      />
      <ForecastInput userId={userId} />
    </div>
  );
}

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

  if (!userId) return <Login onLogin={setUserId} />;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard userId={userId} onLogout={handleLogout} />}
        />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
