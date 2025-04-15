import { useState } from "react";

export default function ForecastInput({ userId, onResult }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForecast = async () => {
    if (!prompt || !userId) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/forecast/natural", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          input_txt: prompt,
        }),
      });

      const data = await res.json();

      if (data.status === "error") {
        onResult({
          explanation: `${data.message}`,
          graph_base64: null,
        });
      } else {
        onResult(data);
      }
    } catch (err) {
      onResult({
        explanation: "Server error. Please try again.",
        graph_base64: null,
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <p>Enter a forecast request:</p>
      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Forecast sales for Coffee Mug for the next 30 days"
      />
      <br />
      <button onClick={handleForecast} disabled={loading}>
        {loading ? "Loading..." : "Generate Forecast"}
      </button>
    </div>
  );
}
