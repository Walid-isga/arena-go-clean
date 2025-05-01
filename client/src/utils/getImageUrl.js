const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export function getImageUrl(filename) {
  if (!filename) return ""; // évite les erreurs si vide
  return `${BASE_URL}/uploads/${filename.startsWith("/") ? filename.slice(1) : filename}`;
}
