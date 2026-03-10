import React from "react";
const { useState, useEffect, useRef } = React;
import LogoAnimation from "./LogoAnimation";

const BASE_URL = import.meta.env.VITE_API_URL;

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activePanel, setActivePanel] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Eğer tıklanan yer wrapperRef (nav + paneller) dışındaysa kapat
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    }

    // Dinleyiciyi ekle
    document.addEventListener("mousedown", handleClickOutside);

    // Bileşen kapandığında dinleyiciyi temizle (Memory leak önlemek için)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    try {
      const endpoint = isRegister
        ? `${BASE_URL}/auth/register`
        : `${BASE_URL}/auth/login`;

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
        <LogoAnimation />
        <div ref={wrapperRef} style={{ position: "relative" }}>
          <nav>
            <button
              className="about-btn"
              onClick={() =>
                setActivePanel(activePanel === "about" ? null : "about")
              }
              aria-expanded={activePanel === "about"}
            >
              About
            </button>
            <button
              className="about-btn"
              onClick={() =>
                setActivePanel(activePanel === "tech" ? null : "tech")
              }
              aria-expanded={activePanel === "tech"}
            >
              Tech Stack
            </button>
            <button
              className="about-btn demo-btn"
              onClick={() =>
                setActivePanel(activePanel === "demo" ? null : "demo")
              }
              aria-expanded={activePanel === "demo"}
            >
              Demo Login
            </button>
          </nav>
        </div>
        <div
          className={`about-panel ${activePanel === "about" ? "visible" : ""}`}
        >
          <div className="about-content">
            <p>
              With this application, you can add and manage time-independent
              tasks or tasks with deadlines.
            </p>
            <ul>
              <li>
                Add tasks, edit them, mark them as completed, and delete them.
              </li>
              <li>
                If there is a deadline, you can also enter a date and easily
                identify and better manage tasks with deadlines.
              </li>
            </ul>
            <hr />

            <p>
              <strong>Über</strong>
              <br />
              <br />
              Mit dieser Anwendung können Sie zeitunabhängige Aufgaben oder
              Aufgaben mit Fristen hinzufügen und diese verwalten.
            </p>
            <ul>
              <li>
                Fügen Sie Aufgaben hinzu, bearbeiten Sie sie, markieren Sie sie
                als erledigt und löschen Sie sie.
              </li>
              <li>
                Wenn es eine Frist gibt, können Sie zusätzlich ein Datum
                eingeben und Aufgaben mit Fristen leicht erkennen und besser
                verwalten.
              </li>
            </ul>
          </div>
        </div>

        {/* TECH STACK PANEL */}
        <div
          className={`about-panel ${activePanel === "tech" ? "visible" : ""}`}
        >
          <div className="built-with-content">
            <p>
              Developed with React, Node.js, and PostgreSQL on Supabase.
              Deployed via Render.
            </p>
            <hr />
            <p>
              <strong>Erstellt mit</strong>
              <br />
              <br />
              Entwickelt mit React, Node.js und PostgreSQL auf Supabase.
              Bereitgestellt über Render.
            </p>
          </div>
        </div>

        {/* DEMO PANEL */}
        <div
          className={`about-panel ${activePanel === "demo" ? "visible" : ""}`}
        >
          <div className="demo-content">
            <p>
              <strong>Username : </strong> Gast
            </p>
            <p>
              <strong>Password : </strong> Gast1234
            </p>
          </div>
        </div>

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
