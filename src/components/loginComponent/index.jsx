// src/components/LoginComponent.js
import React, { useState } from "react";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import "./index.scss";

export default function LoginComponent({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <div>
      <header className="header">
        <div className="icon">
          <h1>
            <img
              src={SFMLOGO}
              alt="ScheduleFM Logo"
              style={{ width: "230px", height: "40px" }}
            />
          </h1>
        </div>
        <div className="logoText" style={{ padding: "1rem" }}>
          Search and Schedule
        </div>
      </header>
      <div className="login_main">
        <form className="login-container">
          <div className="login-heading">Login</div>
          <div className="login-form">
            <div className="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                value={username}
                id="username"
                name="username"
                aria-label="username"
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                aria-label="password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && <p style={{ color: "#e50000" }}>{error}</p>}
            <input
              type="submit"
              className="button"
              value={loading ? "Logging in..." : "Login"}
              onClick={handleLogin}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
