import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("forecast_result"));

  if (!data) return <p>No forecast data found.</p>;

  return (
    <div>
      <h3>Forecast for {data.product}</h3>
      <p>
        <strong>Horizon:</strong> {data.horizon} days
      </p>
      <p>{data.explanation}</p>
      {data.graph && (
        <img
          src={`data:image/png;base64,${data.graph}`}
          alt="Forecast graph"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <br />
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
}

export default Results;
