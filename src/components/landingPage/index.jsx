import React from "react";
import { Link } from "react-router-dom";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import "./index.scss";

export default function LandingPage() {
  return (
    <div className="landing-page">
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
      <main className="content1">
        <nav className="card-container" aria-label="Graphic Design Locations">
          <ul className="card-list">
            <li>
              <Link to="/charlotte" className="card">
                CHARLOTTE
              </Link>
            </li>
            <li>
              <Link to="/untcom" className="card">
                UNTCOM
              </Link>
            </li>
            <li>
              <Link to="/dps" className="card">
                DPS
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
