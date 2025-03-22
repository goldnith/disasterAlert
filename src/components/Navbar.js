import React from "react";
import { FaGlobe, FaBell, FaInfoCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const smoothScroll = (element, offset = 0) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200; // Increased duration for smoother effect
    let start = null;

    const easeInOutCubic = t => {
      // Smoother cubic easing function
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = currentTime => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      window.scrollTo({
        top: startPosition + distance * easeInOutCubic(progress),
        behavior: 'smooth'
      });

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollToAlerts = (e) => {
    e.preventDefault();
    const cardsElement = document.querySelector('.row.g-4');
    if (cardsElement) {
      smoothScroll(cardsElement, -80); // Offset to account for navbar height
    }
  };

  const scrollToFooter = (e) => {
    e.preventDefault();
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      smoothScroll(footerElement);
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <a className="navbar-brand" href="/">
          <FaGlobe className="nav-icon" />
          <span>Disaster Alert</span>
        </a>
        
        <div className="navbar-links">
          <a href="#alerts" 
             className="nav-link" 
             onClick={scrollToAlerts}>
            <FaBell className="nav-icon" />
            <span>Alerts</span>
          </a>
          <a href="#about" 
             className="nav-link"
             onClick={scrollToFooter}>
            <FaInfoCircle className="nav-icon" />
            <span>About</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;