import React from "react";
import "./index.scss";
import Navbar from "../navbar";
import LeftDashboard from "../leftDashboard";
import RightDashboard from "../rightDashboard";
import { FaArrowUp } from "react-icons/fa";

function Searchschedule() {
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
          <RightDashboard />
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

export default Searchschedule;
