import React from "react";
import "./index.scss";
import SFMLOGO from "../../asserts/images/SFM_logo.png";
import Settings from "../../asserts/images/Icons/settings.svg";
import Notification from "../../asserts/images/Icons/notification.svg";
import Help from "../../asserts/images/Icons/help-circle.svg";
import User from "../../asserts/images/Icons/user.svg";
import Logout from "../../asserts/images/Icons/logout.png";

import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="mainNav" id="main">
      <div className="leftNav">
        <div className="logo">
          <h1>
            <img
              src={SFMLOGO}
              alt="ScheduleFM Logo"
              style={{ width: "230px", height: "40px" }}
            />
          </h1>
        </div>
        <div className="logoText">Search and Schedule</div>
      </div>
      <div className="rightNav">
        <div className="menu">
          <div className="submenu">
            <div className="icon">
              <img src={Settings} alt="Settings" />
            </div>
            <div className="text">Settings</div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={Notification} alt="Notification" />
            </div>
            <div className="text">Notifications</div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={Help} alt="Help" />
            </div>
            <div className="text">Help</div>
          </div>
          <div className="submenu">
            <div className="icon" onClick={handleLogout}>
              <img src={Logout} alt="Logout" />
            </div>
            <div className="text" onClick={handleLogout}>
              Logout
            </div>
          </div>
          <div className="submenu">
            <div className="icon">
              <img src={User} alt="User" />
            </div>
            <div className="text">HI Vinod Kumar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
