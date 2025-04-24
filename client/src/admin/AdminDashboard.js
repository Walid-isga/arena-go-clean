import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={4} sx={{ p: 4, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            🎛️ Panneau d'administration
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
            Bienvenue administrateur ! 👋<br />
            Utilisez le menu à gauche pour :
          </Typography>
          <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
            <li>📅 Gérer les réservations</li>
            <li>📊 Consulter les statistiques</li>
            <li>⚙️ Paramétrer les terrains</li>
          </ul>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
