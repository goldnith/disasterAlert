import React from "react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaGlobe, 
  FaBell, 
  FaMapMarkedAlt,
  FaInfoCircle 
} from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h5 className="footer-title">About Disaster Alert</h5>
          <p className="footer-description">
            A real-time disaster monitoring platform that provides instant alerts and comprehensive 
            information about natural disasters worldwide. Our mission is to help communities stay 
            informed and prepared.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <FaGlobe className="feature-icon" />
              <p>Global coverage of natural disasters including earthquakes, floods, wildfires, and more</p>
            </div>
            <div className="feature-item">
              <FaBell className="feature-icon" />
              <p>Real-time alerts and notifications for disasters in your area with customizable radius</p>
            </div>
            <div className="feature-item">
              <FaMapMarkedAlt className="feature-icon" />
              <p>Interactive map visualization with detailed disaster information and impact assessment</p>
            </div>
            <div className="feature-item">
              <FaInfoCircle className="feature-icon" />
              <p>Comprehensive disaster details including severity levels, affected areas, and official recommendations</p>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h5 className="footer-subtitle">Data Sources & Technology</h5>
          <p className="source-info">
            Powered by GDACS (Global Disaster Alert and Coordination System)<br />
            Built with React, Firebase, and Leaflet Maps
          </p>
          <div className="social-links">
            <a href="https://github.com/goldnith/disasterAlert.git" 
               target="_blank" 
               rel="noopener noreferrer"
               title="View source code on GitHub">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/thanganithish-m-464217261/" 
               target="_blank" 
               rel="noopener noreferrer"
               title="Connect on LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:thanganithish11@gmail.com"
               title="Contact us via email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Disaster Alert. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;