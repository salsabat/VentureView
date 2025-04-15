import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error("Invalid JSON from server");
      }

      if (res.ok && data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        onLogin(data.user_id);
      } else {
        throw new Error(data.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Continue
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
}
