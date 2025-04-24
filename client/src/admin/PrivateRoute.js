import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Composant de protection de route.
 * Si l'utilisateur n'est pas connecté, redirection vers login.
 * Si l'utilisateur n'est pas admin, redirection vers la page d'accueil.
 * Sinon, on autorise l'accès à la route protégée.
 */
export default function PrivateRoute({ user, children }) {
  if (!user) {
    console.warn("Redirection : utilisateur non connecté");
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    console.warn("Redirection : utilisateur sans droit admin");
    return <Navigate to="/" />;
  }

  return children;
}
