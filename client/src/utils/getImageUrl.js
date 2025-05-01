// src/utils/getImageUrl.js
export const getImageUrl = (filename) => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const cleaned = filename.startsWith("uploads/") ? filename : `uploads/${filename}`;
    return `${BASE_URL}/${cleaned}`;
  };
  