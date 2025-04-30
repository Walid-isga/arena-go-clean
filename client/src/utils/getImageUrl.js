// src/utils/getImageUrl.js
export const getImageUrl = (filename) => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return `${BASE_URL}/uploads/${filename}`;
  };
  