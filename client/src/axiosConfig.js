import axios from "axios";
import { API_URL } from "./api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ obligatoire pour autoriser le cookie cross-domain
});

export default instance;
