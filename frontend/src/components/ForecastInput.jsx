import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForecastInput({ userId }) {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/forecast/natural", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, input_txt: prompt }),
    });
    const data = await res.json();

    if (data.status === "success") {
      localStorage.setItem("forecast_result", JSON.stringify(data));
      navigate("/results");
    } else {
      alert(data.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Forecast revenue for Notebooks for 7 days"
      />
      <button onClick={handleSubmit}>Generate Forecast</button>
    </div>
  );
}

export default ForecastInput;
