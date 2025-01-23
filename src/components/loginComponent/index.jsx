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
          <img
            src={SFMLOGO}
            alt="logo"
            style={{ width: "230px", height: "40px" }}
          />
        </div>
        <div className="logoText" style={{ padding: "1rem" }}>
          Search and Schedule
        </div>
      </header>
      <div className="login_main">
        <div className="login-container">
          <div className="login-heading">Login</div>
          <div className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
