// client/src/axiosConfig.js
import axios from "axios";
import { API_URL } from "./api"; // api.js contient l'URL dynamique

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // utile si tu utilises les cookies pour les sessions
});

export default instance;
