import React from "react";
import "./index.scss";
import Dashboard from "../../asserts/images/Icons/dashboard.svg";
import Schedule from "../../asserts/images/Icons/Schedule.svg";
import Graphics from "../../asserts/images/Icons/graphics-view.svg";
import Report from "../../asserts/images/Icons/report.svg";

export default function LeftDashboard() {
  return (
    <div className="mainLeftdashboard">
      <div className="navbar">
        <div className="navList">
          <div className="icon">
            <img src={Dashboard} alt="Dashboard" />
          </div>
          <div className="iconText">Dashboard</div>
        </div>
        <div className="navList p">
          <div className="icon">
            <img src={Schedule} alt="Schedule" />
          </div>
          <div className="iconText">Schedule</div>
        </div>
        <div className="navList p">
          <div className="icon">
            <img src={Graphics} alt="Graphics" />
          </div>
          <div className="iconText">Graphics</div>
        </div>
        <div className="navList p">
          <div className="icon">
            <img src={Report} alt="Report" />
          </div>
          <div className="iconText">Report</div>
        </div>
        <div className="navList p">
          <div className="icon">
            <img src={Report} alt="Report" />
          </div>
          <div className="iconText">Billing</div>
        </div>
      </div>
    </div>
  );
}
