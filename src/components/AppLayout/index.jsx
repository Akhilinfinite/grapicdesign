// src/components/AppLayout/index.jsx
import React from "react";
import "./index.scss";
import Navbar from "../navbar";
import LeftDashboard from "../leftDashboard";
import { FaArrowUp } from "react-icons/fa";

export default function AppLayout({ children }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mainPage">
      <a href="#mainContent" className="skipLink">
        Skip to main content
      </a>
      <div className="navBar">
        <Navbar />
      </div>
      <div className="dashBoard">
        <div className="leftDashboard">
          <LeftDashboard />
        </div>
        <div className="rightDashboard" id="mainContent">
          {children}
        </div>
      </div>
      <button
        className="floatingButton"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </div>
  );
}
