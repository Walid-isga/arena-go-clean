// client/src/axiosConfig.js
import axios from "axios";
import { API_URL } from "./api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default instance;
