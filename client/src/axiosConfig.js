// axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://arena-go-clean-production.up.railway.app", // ⬅️ change selon ton backend Railway
  withCredentials: true, // ⬅️ pour que le cookie session soit envoyé
});

export default instance;
