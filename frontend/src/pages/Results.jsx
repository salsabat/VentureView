import { useNavigate } from "react-router-dom";
import "./Results.css";

function Results() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("forecast_result") || "{}");

  if (!data || !data.product) {
    return (
      <div className="results-container no-data">
        <h2>No forecast data found</h2>
        <p>Please generate a forecast first.</p>
        <button className="back-button" onClick={() => navigate("/")}>
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="header-content">
          <h2 className="results-title">Forecast for {data.product}</h2>
        </div>
      </div>

      <div className="results-content">
        <div className="results-meta">
          <div className="meta-item">
            <span className="meta-label">Forecast Horizon</span>
            <span className="meta-value">{data.horizon} days</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Generated On</span>
            <span className="meta-value">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Confidence</span>
            <span className="meta-value">High</span>
          </div>
        </div>

        <h3 className="section-title">Analysis</h3>
        <div className="results-explanation">
          <p>{data.explanation}</p>
        </div>

        <h3 className="section-title">Forecast Visualization</h3>
        <div className="results-graph-container">
          {data.graph && (
            <div className="results-graph">
              <img
                src={`data:image/png;base64,${data.graph}`}
                alt="Forecast graph"
              />
            </div>
          )}
        </div>
      </div>

      <div className="results-actions">
        <div className="actions-content">
          <button className="back-button" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
