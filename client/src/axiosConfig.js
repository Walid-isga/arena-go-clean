// axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://arena-go-backend.up.railway.app",
});

export default instance;
