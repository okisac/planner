import React from "react";
const { useState } = React;

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    try {
      const endpoint = isRegister
        ? "http://localhost:5001/api/auth/register"
        : "http://localhost:5001/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      onLogin({ username: data.username });
    } catch (err) {
      setError("Could not connect to server.");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Logo / Başlık */}
        <div className="login-header">
          <h1 id="login-title">{isRegister ? "Create Account" : "Welcome"}</h1>
          <p className="login-subtitle">
            {isRegister
              ? "Start organizing your day."
              : "Sign in to your planner."}
          </p>
        </div>

        {/* Kart */}
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="login-field">
              <label className="login-label">Username</label>
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                // placeholder="••••••••"
              />
            </div>

            {/* Hata Mesajı */}
            {error && <div className="login-error">{error}</div>}

            {/* Submit Butonu */}
            <button type="submit" className="login-btn">
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Toggle Register/Login */}
        <p className="login-toggle">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Sign In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
