import axios from "axios";

const API_URL = "http://localhost:5000/api/disasters";

export const fetchDisasters = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching disaster data:", error);
    return [];
  }
};
