import React, { useState, useEffect, useRef } from "react";
import DisasterCard from "./DisasterCard";
import "bootstrap/dist/css/bootstrap.min.css";
import DisasterMap from "./DisasterMap";
import '../styles/DisasterList.css';
import { FaLocationArrow, FaExclamationCircle } from "react-icons/fa";
import { FaCalendar, FaFilter } from "react-icons/fa"; // Add this import

const backgroundStyle = {
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, rgba(52, 152, 219, 0.17), rgba(44, 62, 80, 0.17)),
    url('/images/backgroundImage1.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center, center",
  backgroundAttachment: "fixed",
  padding: "2rem 0",
};

const gradientStyle = {
  background: "linear-gradient(135deg, rgba(44, 62, 80, 0.17), rgba(52, 152, 219, 0.97))"
};

const containerStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 20px",
  position: "relative",
  zIndex: "1"
};

const headerStyle = {
  marginBottom: "2rem",
  textAlign: "center",
  color: "#ffffff",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)"
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  ...gradientStyle,  // Apply gradient
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  color: "white",
  fontWeight: "500",
  transition: "all 0.2s ease",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "2rem",
  "&:hover": {
    opacity: 0.9,
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)"
  }
};

const loadingStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#ffffff",
  fontSize: "18px",
  ...gradientStyle,  // Apply gradient
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const errorStyle = {
  textAlign: "center",
  padding: "15px",
  ...gradientStyle,  // Apply gradient
  color: "#ffffff",
  borderRadius: "12px",
  border: "1px solid rgba(229, 62, 62, 0.4)",
  marginBottom: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  backdropFilter: "blur(10px)"
};

const filterButtonStyle = {
  ...buttonStyle,
  padding: "8px 16px",
  marginRight: "10px",
  marginBottom: "1rem",
};

const filterContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "2rem",
};

const noAlertsStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "#ffffff",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  marginBottom: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};



const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsContainerRef = useRef(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async (lat = null, lon = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://localhost:5000/api/disasters";
      if (lat && lon) {
        url += `?lat=${lat}&lon=${lon}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const rawData = await response.json();
      console.log("Fetched Data:", rawData); // Debugging log

      // Transforming data properly
      const formattedDisasters = rawData.map((item) => ({
        title: item.title ?? "No title",
        description: item.description ?? "No description available.",
        link: item.link ?? "#",
        type: item["gdacs:eventtype"] ?? "Unknown", // Corrected event type
        location: item["gdacs:country"] ?? "Unknown", // Corrected location
        alertLevel: item["gdacs:alertlevel"] ?? "Unknown", // Corrected alert level
        time: item["gdacs:fromdate"]
          ? new Date(item["gdacs:fromdate"]).toLocaleString()
          : "Unknown",
        image:
          item?.enclosure?.["$"]?.url ??
          "https://via.placeholder.com/150", // Default image
      }));

      setDisasters(rawData.filter(disaster => {
        if (!lat || !lon) return true;
        
        // Calculate distance between user and disaster
        const disasterLat = parseFloat(disaster["geo:Point"]?.["geo:lat"]);
        const disasterLon = parseFloat(disaster["geo:Point"]?.["geo:long"]);
        
        if (!disasterLat || !disasterLon) return false;
        
        const distance = calculateDistance(lat, lon, disasterLat, disasterLon);
        return distance <= 1000; // Show disasters within 1000km radius
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleNearbyAlerts = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
  
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }
  
      // Check for permissions
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'denied') {
        throw new Error("Location permission is required. Please enable it in your browser settings.");
      }
  
      // Get position with a timeout of 10 seconds
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Location request timed out. Please try again."));
        }, 10000);
  
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (err) => {
            clearTimeout(timeoutId);
            reject(err);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
  
      const { latitude, longitude } = position.coords;
      setLat(latitude);  // Set the latitude
      setLon(longitude); // Set the longitude
      await fetchDisasters(latitude, longitude);
      
      // Scroll to map after loading nearby disasters
      const mapElement = document.querySelector('.leaflet-container');
      mapElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
    } catch (error) {
      setLocationError(
        error.code === 1 
          ? "Location access denied. Please enable location permissions in your browser settings."
          : error.message || "Failed to get location"
      );
      setLat(null); // Reset coordinates on error
      setLon(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const resetLocationFilter = () => {
    setLat(null);
    setLon(null);
    fetchDisasters(); // Fetch all disasters without location parameters
  };

  const [timeFilter, setTimeFilter] = useState('all');
  
  const filterDisastersByTime = (disasters, filter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return disasters.filter(disaster => {
      const disasterDate = new Date(disaster["gdacs:fromdate"]);
      switch (filter) {
        case 'today':
          return disasterDate >= today;
        case 'week':
          return disasterDate >= thisWeek;
        case 'month':
          return disasterDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const scrollToCards = () => {
    cardsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 className="display-4 fw-bold">Global Disaster Alerts</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            Real-time monitoring of natural disasters worldwide
          </p>
        </header>

        <div className="d-flex justify-content-center mb-4">
          <button 
            className="btn" 
            style={{
              ...buttonStyle,
              opacity: isLoadingLocation ? 0.7 : 1,
              cursor: isLoadingLocation ? 'not-allowed' : 'pointer'
            }}
            onClick={handleNearbyAlerts}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Getting Location...
              </>
            ) : (
              <>
                <FaLocationArrow />
                Show Nearby Alerts
              </>
            )}
          </button>
          {locationError && (
            <div style={{
              ...errorStyle,
              marginTop: '1rem'
            }}>
              <FaExclamationCircle />
              <span>{locationError}</span>
            </div>
          )}
        </div>

        <div style={filterContainerStyle}>
          <button
            className={`btn ${timeFilter === 'all' ? 'active' : ''}`}
            style={filterButtonStyle}
            onClick={() => {
              setTimeFilter('all');
              resetLocationFilter();
              scrollToCards();
            }}
          >
            <FaFilter className="me-2" />
            All Alerts
          </button>
          <button
            className={`btn ${timeFilter === 'today' ? 'active' : ''}`}
            style={filterButtonStyle}
            onClick={() => {
              setTimeFilter('today');
              scrollToCards();
            }}
          >
            <FaCalendar className="me-2" />
            Today
          </button>
          <button
            className={`btn ${timeFilter === 'week' ? 'active' : ''}`}
            style={filterButtonStyle}
            onClick={() => {
              setTimeFilter('week');
              scrollToCards();
            }}
          >
            <FaCalendar className="me-2" />
            This Week
          </button>
          <button
            className={`btn ${timeFilter === 'month' ? 'active' : ''}`}
            style={filterButtonStyle}
            onClick={() => {
              setTimeFilter('month');
              scrollToCards();
            }}
          >
            <FaCalendar className="me-2" />
            This Month
          </button>
        </div>

        {loading && (
          <div style={loadingStyle}>
            <div className="spinner-border text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Loading disaster data...</span>
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            <FaExclamationCircle />
            <span>Error: {error}</span>
          </div>
        )}

        {/* Disaster Map */}
        <div className="mb-4">
          <DisasterMap disasters={disasters} />
        </div>

        <div className="row g-4" ref={cardsContainerRef}>
          {!loading && !error && filterDisastersByTime(disasters, timeFilter).length === 0 ? (
            <div className="col-12">
              <div style={noAlertsStyle}>
                <FaExclamationCircle size={32} />
                <h4>No Alerts Found</h4>
                <p className="mb-0">
                  {timeFilter !== 'all' 
                    ? `No disaster alerts found for the selected time period.`
                    : lat && lon 
                      ? `No disaster alerts found in your area.`
                      : `No disaster alerts available at the moment.`
                  }
                </p>
              </div>
            </div>
          ) : (
            filterDisastersByTime(disasters, timeFilter).map((disaster, index) => (
              <DisasterCard key={index} disaster={disaster} />
            ))
          )}
        </div>
      </div>
    </div>  
  );
};

export default DisasterList;
