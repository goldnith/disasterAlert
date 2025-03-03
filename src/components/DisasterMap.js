import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import '../styles/DisasterMap.css';

// Fix default marker issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Update the custom icon styles
const getCustomIcon = (alertLevel, eventType) => {
  const iconSize = [32, 32];
  const iconAnchor = [16, 32];
  const popupAnchor = [0, -32];

  const getIconColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'red': return '#dc3545';
      case 'orange': return '#fd7e14';
      case 'green': return '#28a745';
      default: return '#6c757d';
    }
  };

  const color = getIconColor(alertLevel);

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        ${eventType?.slice(0, 2) || '?'}
      </div>
    `,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  });
};

// Add custom popup styles
const customPopupStyle = {
  className: 'custom-popup',
  closeButton: true,
  autoPan: true,
  maxWidth: 300
};

// Update the map styles for a modern look
const mapContainerStyle = {
  height: "600px",
  width: "100%",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  background: "linear-gradient(135deg, rgba(36, 57, 73, 0.97), rgba(81, 127, 164, 0.97))",
  padding: "4px",
  position: "relative",
  margin: "24px 0",
  overflow: "hidden"
};

// Modern wrapper style with glassmorphism effect
const mapWrapperStyle = {
  position: "relative",
  padding: "16px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)"
};

const DisasterMap = ({ disasters }) => {
  return (
    <div style={mapWrapperStyle}>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={mapContainerStyle}
        scrollWheelZoom={true}
        minZoom={2}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
        />
        
        {disasters.map((disaster, index) => {
          if (!disaster["geo:Point"]?.["geo:lat"] || !disaster["geo:Point"]?.["geo:long"]) {
            return null;
          }

          const latitude = parseFloat(disaster["geo:Point"]["geo:lat"]);
          const longitude = parseFloat(disaster["geo:Point"]["geo:long"]);

          if (isNaN(latitude) || isNaN(longitude)) return null;

          return (
            <Marker
              key={disaster["gdacs:eventid"] || index}
              position={[latitude, longitude]}
              icon={getCustomIcon(disaster["gdacs:alertlevel"], disaster["gdacs:eventtype"])}
            >
              <Popup {...customPopupStyle}>
                <div className="disaster-popup">
                  <h4 className="popup-title">{disaster.title}</h4>
                  <p className="popup-description">{disaster.description}</p>
                  <div className="popup-details">
                    <span className="alert-badge" style={{
                      backgroundColor: disaster["gdacs:alertlevel"]?.toLowerCase() === "red" ? "#ff4444" :
                                     disaster["gdacs:alertlevel"]?.toLowerCase() === "orange" ? "#ffbb33" : "#00C851"
                    }}>
                      {disaster["gdacs:alertlevel"]} Alert
                    </span>
                    <span className="event-type">{disaster["gdacs:eventtype"]}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
