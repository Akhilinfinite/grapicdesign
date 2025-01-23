import React from "react";
import { Link } from "react-router-dom";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import "./index.scss";

export default function LandingPage() {
  return (
    <div className="landing-page">
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
      <main className="content1">
        <div className="card-container">
          <Link to="/graphicDesign/charlotte" className="card">
            <h3>CHARLOTTE</h3>
          </Link>

          <Link to="/graphicDesign/untcom" className="card">
            <h3>UNTCOM</h3>
          </Link>

          <Link to="/graphicDesign/dps" className="card">
            <h3>DPS</h3>
          </Link>
        </div>
      </main>
    </div>
  );
}
