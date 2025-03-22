import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../styles/DisasterCard.css";
import { 
  FaFire, 
  FaWater, 
  FaExclamationTriangle, 
  FaQuestion, 
  FaExternalLinkAlt,
  FaSun,  // Add this import for drought
  FaWind,  // Add this import for tropical cyclone
  FaMountain,  // Add for volcanic eruption
  FaArrowDown,  // Add for landslide
  FaWaveSquare  // Add for tsunami
} from "react-icons/fa";


const cardStyle = {
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "linear-gradient(135deg, rgba(44, 62, 80, 0.99), rgba(52, 152, 219, 0.07))",
  color: "#ffffff",
  backdropFilter: "blur(10px)",
  transform: "translateZ(0)", // Enable hardware acceleration
  willChange: "transform, box-shadow", // Optimize animations
};

const imageStyle = {
  borderRadius: "12px",
  objectFit: "cover",
  objectPosition: "center",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "translateZ(0)", // Enable hardware acceleration
};

const badgeStyle = (alertLevel) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  backgroundColor: getAlertColor(alertLevel),
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
});

const modalStyle = {
  borderRadius: "20px",
  background: "linear-gradient(135deg, rgba(44, 62, 80, 0.17), rgba(52, 152, 219, 0.17))",
};

const modalContentStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  color: "#ffffff",
};

const detailBoxStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  padding: "1rem",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(5px)",
};

const modalTransition = {
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "translateZ(0)",
  willChange: "transform, opacity",
};

const IMAGE_DIMENSIONS = {
  card: {
    height: "200px",
    width: "100%"
  },
  modal: {
    height: "300px",
    width: "100%"
  }
};



const getTypeIcon = (type) => {
  if (!type) return <FaQuestion className="me-2" />;
  
  switch (type.toUpperCase()) {
    case "EQ":
      return <FaExclamationTriangle className="me-2" style={{ color: '#ffbb33' }} />;
    case "FL":
      return <FaWater className="me-2" style={{ color: '#33b5e5' }} />;
    case "WF":
      return <FaFire className="me-2" style={{ color: '#ff4444' }} />;
    case "DR":
      return <FaSun className="me-2" style={{ color: '#ffd700' }} />;  // Gold color for drought
    case "TC":
      return <FaWind className="me-2" style={{ color: '#00ffff' }} />;  // Cyan color for cyclone
    case "VO":
      return <FaMountain className="me-2" style={{ color: '#ff6b6b' }} />; // Red-orange for volcano
    case "LS":
      return <FaArrowDown className="me-2" style={{ color: '#8B4513' }} />; // Brown for landslide
    case "TS":
      return <FaWaveSquare className="me-2" style={{ color: '#4169E1' }} />; // Royal blue for tsunami
    default:
      return <FaQuestion className="me-2" style={{ color: 'white' }} />;
  }
};

const DUMMY_IMAGE = "https://placehold.co/600x400/gray/white?text=No+Image+Available";

const DisasterCard = ({ disaster }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div className="col-md-6 col-lg-4 mb-4">
        <div
          className="card h-100 disaster-card"
          style={{
            ...cardStyle,
            backgroundColor: `${getAlertColor(disaster["gdacs:alertlevel"])}15`,
          }}
          onClick={() => setShow(true)}
        >
          <div className="position-relative">
            <img
              src={disaster.enclosure?.$?.url || DUMMY_IMAGE}
              alt={disaster.title}
              className={`card-img-top p-3 ${imageLoaded ? 'loaded' : ''}`}
              style={imageStyle}
              height="200"
              onLoad={() => setImageLoaded(true)}
            />
            <span
              className="position-absolute top-0 end-0 m-4"
              style={badgeStyle(disaster["gdacs:alertlevel"])}
            >
              <div className="d-flex align-items-center">
                {getTypeIcon(disaster["gdacs:eventtype"])}
                {disaster["gdacs:alertlevel"]} Alert
              </div>
            </span>
          </div>

          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">{disaster.title}</h5>
            <div className="d-flex align-items-center mb-2">
              {getTypeIcon(disaster['gdacs:eventtype'])}
              <span className="ms-2">{disaster['gdacs:eventtype'] || 'Unknown'}</span>
            </div>
            <p className="card-text mb-2">
              <small className="text-white-muted">{disaster["gdacs:country"]}</small>
            </p>
            <p className="card-text">
              <small className="text-white-muted">{disaster["gdacs:fromdate"]}</small>
            </p>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
        contentClassName="border-0"
        style={modalStyle}
        dialogClassName="modal-90w"
      >
        <div style={modalContentStyle}>
          <Modal.Header closeButton className="border-0">
            <span style={badgeStyle(disaster["gdacs:alertlevel"])}>
              <div className="d-flex align-items-center">
                {getTypeIcon(disaster["gdacs:eventtype"])}
                {disaster["gdacs:alertlevel"]} Alert
              </div>
            </span>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <img
                src={disaster?.enclosure?.$?.url || DUMMY_IMAGE}
                alt={disaster?.title || 'Disaster Image'}
                className={`img-fluid rounded-4 ${imageLoaded ? 'loaded' : ''}`}
                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Title and Description */}
            <h4 className="mb-4">{disaster?.title}</h4>
            <p className="text-white-muted mb-4">{disaster?.description}</p>
            
            {/* Details Grid */}
            <div className="d-flex flex-wrap gap-4 mb-4">
              {/* Type */}
              <div className={detailBoxStyle}>
                <strong>Event Details:</strong>
                <div className="d-flex align-items-center mt-2">
                  {getTypeIcon(disaster?.["gdacs:eventtype"])}
                  <span className="ms-2">
                    {disaster?.["gdacs:eventtype"] || 'Unknown'}
                    {disaster?.["gdacs:eventname"] && ` - ${disaster["gdacs:eventname"]}`}
                  </span>
                </div>
                <p className="mt-2 mb-0">
                  Version: {disaster?.["gdacs:version"]}
                  <br />
                  Event ID: {disaster?.["gdacs:eventid"]}
                </p>
              </div>

              {/* Location */}
              <div className={detailBoxStyle}>
                <strong>Location:</strong>
                <p className="mt-2 mb-0">
                  Country: {disaster?.["gdacs:country"]}
                  <br />
                  ISO: {disaster?.["gdacs:iso3"]}
                  <br />
                  GLIDE: {disaster?.["gdacs:glide"] || 'Not available'}
                </p>
              </div>

              {/* Time */}
              <div className={detailBoxStyle}>
                <strong>Duration:</strong>
                <p className="mt-2 mb-0">
                  From: {new Date(disaster?.["gdacs:fromdate"]).toLocaleString()}
                  <br />
                  To: {new Date(disaster?.["gdacs:todate"]).toLocaleString()}
                  <br />
                  Duration in weeks: {disaster?.["gdacs:durationinweek"]}
                </p>
              </div>

              {/* Severity */}
              <div className={detailBoxStyle}>
                <strong>Alert Information:</strong>
                <p className="mt-2 mb-0">
                  Level: {disaster?.["gdacs:alertlevel"]}
                  <br />
                  Score: {disaster?.["gdacs:alertscore"]}
                  <br />
                  Episode Level: {disaster?.["gdacs:episodealertlevel"]}
                  <br />
                  Episode Score: {disaster?.["gdacs:episodealertscore"]}
                  <br />
                  Severity: {disaster?.["gdacs:severity"]?._}
                </p>
              </div>

              {/* Population */}
              <div className={detailBoxStyle}>
                <strong>Impact Assessment:</strong>
                <p className="mt-2 mb-0">
                  Population: {disaster?.["gdacs:population"]?._}
                  <br />
                  Vulnerability: {disaster?.["gdacs:vulnerability"]?.$.value || 'Not available'}
                </p>
              </div>
            {/* </div> */}

            {/* Coordinates */}
            <div className={detailBoxStyle}>
              <strong>Geographic Data:</strong>
              <p className="mt-2 mb-0">
                Latitude: {disaster?.["geo:Point"]?.["geo:lat"]}
                <br />
                Longitude: {disaster?.["geo:Point"]?.["geo:long"]}
                <br />
                Bounding Box: {disaster?.["gdacs:bbox"]}
              </p>
            </div>

            {/* Resources */}
            <div className={detailBoxStyle}>
              <strong>Additional Resources:</strong>
              <div className="d-flex flex-column gap-2 mt-2">
              {disaster?.["gdacs:cap"] && (
                <a 
                  href={disaster["gdacs:cap"]} 
                  className="btn btn-sm btn-light d-flex align-items-center justify-content-between"
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="View technical alert details in CAP format"
                >
                  <div>
                    <FaExternalLinkAlt className="me-2" />
                    CAP Alert
                    <small className="ms-2 text-muted">(Technical Details)</small>
                  </div>
                </a>
              )}
              {disaster?.["gdacs:resources"]?.["gdacs:resource"]?.["$"]?.url && (
                <a 
                  href={disaster["gdacs:resources"]["gdacs:resource"]["$"].url}
                  className="btn btn-sm btn-light d-flex align-items-center justify-content-between"
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Subscribe to real-time updates for this disaster"
                >
                  <div>
                    <FaExternalLinkAlt className="me-2" />
                    RSS Feed
                    <small className="ms-2 text-muted">(Live Updates)</small>
                  </div>
                </a>
              )}
                {disaster?.["gdacs:gtslink"] && (
                  <a href={disaster["gdacs:gtslink"]}
                    className="btn btn-sm btn-light"
                    target="_blank" 
                    rel="noopener noreferrer">
                    <FaExternalLinkAlt className="me-2" />
                    GTS Link
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Action Button */}
          <a
            href={disaster?.link}
            className="btn btn-light d-flex align-items-center gap-2 w-auto mt-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Report <FaExternalLinkAlt size={14} />
          </a>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

// Function to determine alert level color
const getAlertColor = (level) => {
  switch (level?.toLowerCase()) {
    case "green":
      return "#28a745";
    case "orange":
      return "#fd7e14";
    case "red":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

export default DisasterCard;
