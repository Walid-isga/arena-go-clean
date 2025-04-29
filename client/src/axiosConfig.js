import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "https://arena-go-clean-production.up.railway.app";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important pour les cookies
});

export default instance;
