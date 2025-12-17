import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

// Import local images correctly
import logo from "./assets/Group.svg"; 
import homeActive from "./assets/home-active.svg";
import homeInactive from "./assets/home.svg";
import tradeActive from "./assets/trend-up-active.svg";
import tradeInactive from "./assets/trend-up.svg";
import settingsActive from "./assets/empty-wallet.svg";
import settingsInactive from "./assets/empty-wallet.svg";
import profileActive from "./assets/profile.svg";
import profileInactive from "./assets/profile.svg";
import layoutActive from "./assets/profile.svg"; // Add Layout active icon
import layoutInactive from "./assets/profile.svg"; // Add Layout inactive icon

const Navbar = ({ style = {} }) => {
  const location = useLocation(); // Get current path

  // Define images for active and inactive states
  const icons = {
    home: {
      active: homeActive,
      inactive: homeInactive
    },
    trademain: {
      active: tradeActive,
      inactive: tradeInactive
    },
    layout: {  // Add Layout icon
      active: layoutActive,
      inactive: layoutInactive
    },
    support: {
      active: settingsActive,
      inactive: settingsInactive
    },
    profile: {
      active: profileActive,
      inactive: profileInactive
    }
  };

  return (
    <div className="navbar" style={style}>
      <div className="navbar-content">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <img
            src={location.pathname === "/" ? icons.home.active : icons.home.inactive}
            alt="Home"
            className="nav-icon"
          />
          <span className="nav-label">Home</span>
        </Link>

        <Link to="/trademain" className={`nav-item ${location.pathname === "/trademain" ? "active" : ""}`}>
          <img
            src={location.pathname === "/trademain" ? icons.trademain.active : icons.trademain.inactive}
            alt="Trade"
            className="nav-icon"
          />
          <span className="nav-label">Trade</span>
        </Link>

        <div className="nav-logo action-item">
          <img src={logo} alt="Action" className="nav-icon action-icon" />
        </div>

        <Link to="/support" className={`nav-item ${location.pathname === "/support" ? "active" : ""}`}>
          <img
            src={location.pathname === "/support" ? icons.support.active : icons.support.inactive}
            alt="Support"
            className="nav-icon"
          />
          <span className="nav-label">Support</span>
        </Link>

        <Link to="/settings" className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}>
          <img
            src={location.pathname === "/settings" ? icons.layout.active : icons.layout.inactive}
            alt="Layout"
            className="nav-icon"
          />
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
