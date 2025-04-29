import React from "react";
import { Avatar, Box, Typography, Paper } from "@mui/material";
import "../Profile Information/ProfileInformation.css"; // ✅ Ton style

import defaultProfile from "../Assets/profile.gif"; // Image par défaut

export default function ProfileInformation({ user }) {
  if (!user) return <p>Chargement du profil...</p>;

  const { username, picture } = user;

  const getPictureUrl = () => {
    if (!picture) return defaultProfile;
    if (typeof picture === "string" && picture.startsWith("/uploads")) {
      return `${picture}`;
    }
    return picture; // Sinon c’est déjà une URL complète
  };

  return (
    <Paper elevation={4} className="profile-card fade-in">
      <Box textAlign="center" p={3}>
        <Avatar
          src={getPictureUrl()}
          alt="Profile picture"
          className="profile-avatar"
        />
        <Typography variant="h5" className="profile-username">
          {username || "Utilisateur"}
        </Typography>
        <Typography variant="body2" className="profile-role">
          Membre ArenaGo
        </Typography>
      </Box>
    </Paper>
  );
}
