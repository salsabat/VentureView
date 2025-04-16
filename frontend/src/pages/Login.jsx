import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: new URLSearchParams({ email }),
      });
      const data = await res.json();

      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_email", email);
        onLogin(data.user_id);
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      alert("Error connecting to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>VentureView</h2>
        <p className="app-tagline">Business Intelligence & Forecasting</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading || !email.trim()}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
