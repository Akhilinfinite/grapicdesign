import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../asserts/images/Icons/dashboard.svg";
import Schedule from "../../asserts/images/Icons/Schedule.svg";
import Graphics from "../../asserts/images/Icons/graphics-view.svg";
import Report from "../../asserts/images/Icons/report.svg";
import { useSelector } from "react-redux";

export default function LeftDashboard() {
  const reduxClient = useSelector((state) => state.client.clientname);
  const clientname = reduxClient || localStorage.getItem("clientname");
  const navigate = useNavigate();
  const navigateToSchedule = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/${clientname}/SearchSchedule`);
  };
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
          <div className="iconText" onClick={navigateToSchedule}>
            Schedule
          </div>
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
