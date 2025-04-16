import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UploadCSV from "./components/UploadCSV";
import ForecastInput from "./components/ForecastInput";
import Results from "./pages/Results";
import "./pages/Dashboard.css";

function Dashboard({ userId, onLogout }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="dashboard-title">VentureView</h2>
        <div className="dashboard-actions">
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Data Management</h2>
            <UploadCSV
              userId={userId}
              onUpload={(info) => console.log("Uploaded:", info)}
            />
          </div>
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Forecasting</h2>
            <ForecastInput userId={userId} />
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} VentureView. All rights reserved.</p>
      </footer>
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
