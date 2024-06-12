import React from "react";
import "./index.scss";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import Settings from "../../asserts/images/Icons/settings.svg";
import Notification from "../../asserts/images/Icons/notification.svg";
import Help from "../../asserts/images/Icons/help-circle.svg";
import User from "../../asserts/images/Icons/user.svg";

export default function Navbar() {
  return (
    <div className="mainNav">
      <div className="leftNav">
        <div className="logo">
          <img
            src={SFMLOGO}
            alt="logo"
            style={{ width: "230px", height: "40px" }}
          />
        </div>
        <div className="logoText">Search and Schedule</div>
      </div>
      <div className="rightNav">
        <div className="menu">
          <div className="submenu">
            <div className="icon">
              <img src={Settings} alt="logo" />
            </div>
            <div className="text">Settings</div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={Notification} alt="logo" />
            </div>
            <div className="text">Notifications</div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={Help} alt="logo" />
            </div>
            <div className="text">Help</div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={User} alt="logo" />
            </div>
            <div className="text">HI Vinod Kumar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
