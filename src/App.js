import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DisasterList from "./components/DisasterList";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/disasters")
      .then((res) => res.json())
      .then((data) => setDisasters(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <DisasterList disasters={disasters} />
      <Footer />
    </div>
  );
};

export default App;
