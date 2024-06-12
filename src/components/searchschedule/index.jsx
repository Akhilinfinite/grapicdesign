import React from "react";
import "./index.scss";
import Navbar from "../navbar";
import LeftDashboard from "../leftDashboard";
import RightDashboard from "../rightDashboard";

function Searchschedule() {
  return (
    <div className="mainPage">
      <div className="navBar">
        <Navbar />
      </div>
      <div className="dashBoard">
        <div className="leftDashboard">
          <LeftDashboard />
        </div>
        <div className="rightDashboard">
          <RightDashboard />
        </div>
      </div>
    </div>
  );
}

export default Searchschedule;
