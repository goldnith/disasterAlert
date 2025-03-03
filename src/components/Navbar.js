import React from "react";
import { FaGlobe, FaBell, FaInfoCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <a className="navbar-brand" href="/">
          <FaGlobe className="nav-icon" />
          <span>Disaster Alert</span>
        </a>
        
        <div className="navbar-links">
          <a href="/alerts" className="nav-link">
            <FaBell className="nav-icon" />
            <span>Alerts</span>
          </a>
          <a href="/about" className="nav-link">
            <FaInfoCircle className="nav-icon" />
            <span>About</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;