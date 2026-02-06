import React, { useState } from "react";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import CALENDAR_IMG from "../../asserts/images/Group.png";
import "./index.scss";

export default function LoginComponent({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="sfm-header">
        <div className="sfm-header-left">
          <img src={SFMLOGO} alt="ScheduleFM Logo" className="sfm-logo" />
        </div>

        <div className="sfm-header-right">
          A complete facility scheduling solution
        </div>
      </header>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Side */}
        <div className="login-left" aria-hidden="true">
          <h2 className="login-title">Manage Facilities and More</h2>
          <p className="login-subtext">
            Handle all the details in one place, with optional extensions
            available to expand ScheduleFM’s capabilities.
          </p>
          <img
            src={CALENDAR_IMG}
            alt="Illustration of scheduling"
            className="login-illustration"
          />
        </div>

        {/* Right Side */}
        <div className="login-right">
          <form className="login-container" onSubmit={handleLogin}>
            <div className="login-heading">Login</div>

            <div className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  aria-label="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    aria-label="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    onClick={() => setPasswordVisible((p) => !p)}
                  >
                    <span className="material-icons" aria-hidden="true">
                      {passwordVisible ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-row remember-row">
                <label className="remember-container">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="remember-label">Remember me</span>
                </label>

                <a
                  href="/"
                  className="forgot-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot Password?
                </a>
              </div>

              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}

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
      <footer className="footer-container">
        <div className="footer-left">
          <p>© GraphicVision - All rights reserved.</p>
        </div>

        <div className="footer-center">
          <p>Connect with GraphicVision on Social</p>
        </div>

        <div className="footer-right">
          <ul className="list-inline p-2 footerStyle_3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="230"
              height="35"
              viewBox="0 0 201 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.928 17.8798H10.4338V11.9984H9.1875V9.97187H10.4338V8.7552C10.4338 7.10205 11.1372 6.11847 13.1368 6.11847H14.8011V8.14575H13.7609C12.9825 8.14575 12.931 8.42895 12.931 8.95748L12.9276 9.97187H14.8125L14.5919 11.9984H12.9276V17.8798H12.928Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C18.6245 0 24 5.37552 24 11.9982C24 18.6245 18.6245 23.9982 12 23.9982C5.37552 23.9982 0 18.6245 0 11.9982C0 5.37552 5.37552 0 12 0ZM12 0.999113C5.92756 0.999113 1 5.92703 1 11.9983C1 18.0728 5.92756 22.9991 12 22.9991C18.0724 22.9991 23 18.0728 23 11.9983C23 5.92703 18.0724 0.999113 12 0.999113Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M75.9049 8.2382C76.4488 7.895 76.8661 7.3508 77.0619 6.70253C76.5527 7.0211 75.99 7.25149 75.3897 7.37622C74.9106 6.83599 74.2259 6.49915 73.4681 6.49915C72.0143 6.49915 70.8362 7.74246 70.8362 9.27576C70.8362 9.49344 70.8581 9.70556 70.9032 9.90814C68.7158 9.79215 66.7761 8.68786 65.4767 7.0068C65.25 7.41833 65.1205 7.895 65.1205 8.40345C65.1205 9.36633 65.5852 10.2164 66.2918 10.7153C65.8602 10.701 65.4541 10.5747 65.0986 10.3681V10.4023C65.0986 11.7481 66.0055 12.8707 67.2115 13.1249C66.99 13.19 66.758 13.2226 66.517 13.2226C66.3475 13.2226 66.1818 13.2059 66.0221 13.1733C66.3566 14.276 67.329 15.08 68.4815 15.1015C67.5799 15.8467 66.4447 16.29 65.2116 16.29C64.9992 16.29 64.789 16.2781 64.5834 16.2519C65.7487 17.0392 67.1324 17.4991 68.6194 17.4991C73.4628 17.4991 76.1098 13.2679 76.1098 9.59831C76.1098 9.47755 76.1083 9.35759 76.103 9.23921C76.6175 8.84755 77.0649 8.35817 77.4167 7.80125C76.9444 8.02211 76.4367 8.17147 75.9049 8.2382Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M71 0C77.6245 0 83 5.37552 83 11.9982C83 18.6245 77.6245 23.9982 71 23.9982C64.3755 23.9982 59 18.6245 59 11.9982C59 5.37552 64.3755 0 71 0ZM71 0.999113C64.9276 0.999113 60 5.92703 60 11.9983C60 18.0728 64.9276 22.9991 71 22.9991C77.0724 22.9991 82 18.0728 82 11.9983C82 5.92703 77.0724 0.999113 71 0.999113Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M183.942 10.1649H186.018V17.1121H183.942V10.1649ZM184.927 9.2959H184.912C184.161 9.2959 183.673 8.76482 183.673 8.0923C183.673 7.40603 184.175 6.88544 184.942 6.88544C185.708 6.88544 186.179 7.40472 186.194 8.09034C186.194 8.76286 185.708 9.2959 184.927 9.2959ZM194.327 17.1127H191.972V13.517C191.972 12.576 191.604 11.9342 190.794 11.9342C190.174 11.9342 189.83 12.3671 189.67 12.7855C189.61 12.9348 189.619 13.1437 189.619 13.3533V17.1127H187.286C187.286 17.1127 187.316 10.7437 187.286 10.1649H189.619V11.2552C189.757 10.7785 190.502 10.0981 191.692 10.0981C193.167 10.0981 194.327 11.098 194.327 13.2492V17.1127Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M189 0C195.624 0 201 5.37552 201 11.9982C201 18.6245 195.624 23.9982 189 23.9982C182.376 23.9982 177 18.6245 177 11.9982C177 5.37552 182.376 0 189 0ZM189 0.999113C182.928 0.999113 178 5.92703 178 11.9983C178 18.0728 182.928 22.9991 189 22.9991C195.072 22.9991 200 18.0728 200 11.9983C200 5.92703 195.072 0.999113 189 0.999113Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M130 0C136.624 0 142 5.37552 142 11.9982C142 18.6245 136.624 23.9982 130 23.9982C123.376 23.9982 118 18.6245 118 11.9982C118 5.37552 123.376 0 130 0ZM130 0.999113C123.928 0.999113 119 5.92703 119 11.9983C119 18.0728 123.928 22.9991 130 22.9991C136.072 22.9991 141 18.0728 141 11.9983C141 5.92703 136.072 0.999113 130 0.999113Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M136.506 14.4177V9.58059C136.506 9.58059 136.506 7.24915 134.264 7.24915H125.735C125.735 7.24915 123.494 7.24915 123.494 9.58059V14.4177C123.494 14.4177 123.494 16.7491 125.735 16.7491H134.264C134.264 16.7491 136.506 16.7491 136.506 14.4177ZM132.526 12.0059L128.266 14.607V9.40401L132.526 12.0059Z"
                fill="white"
              />
            </svg>
          </ul>
        </div>
      </footer>
    </div>
  );
}
