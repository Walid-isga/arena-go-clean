import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateUserRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    console.warn("⛔ Redirection : utilisateur non connecté");
    return <Navigate to="/login" />;
  }

  if (user.isAdmin) {
    console.warn("⛔ Redirection : admin tenté d'accéder à un espace utilisateur");
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
}
