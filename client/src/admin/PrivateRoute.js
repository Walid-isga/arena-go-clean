import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ on récupère le user via contexte

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    console.warn("⛔ Redirection : utilisateur non connecté");
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    console.warn("⛔ Redirection : utilisateur sans droit admin");
    return <Navigate to="/" />;
  }

  return children;
}
