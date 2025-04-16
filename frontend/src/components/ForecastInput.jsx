import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForecastInput.css";

function ForecastInput({ userId }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const user_id = String(userId);

      const res = await fetch("http://localhost:8000/forecast/natural", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, input_txt: prompt }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("forecast_result", JSON.stringify(data));
        navigate("/results");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      alert("Error connecting to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forecast-input-container">
      <h3>Generate Forecast</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Forecast revenue for Notebooks for 7 days"
      />
      <button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
        {isLoading ? "Generating..." : "Generate Forecast"}
      </button>
    </div>
  );
}

export default ForecastInput;
