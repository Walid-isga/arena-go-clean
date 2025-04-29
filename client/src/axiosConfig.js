import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ex: https://arena-go-clean-production.up.railway.app
  withCredentials: true,
});

export default instance;
