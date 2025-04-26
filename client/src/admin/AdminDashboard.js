import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ fields: 0, bookings: 0, users: 0 });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Erreur stats :", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
          🎛️ Dashboard Administrateur
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, backgroundColor: "#1e1e1e", color: "#fff" }}>
              <Typography variant="h6">Terrains</Typography>
              <Typography variant="h3">{stats.fields}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, backgroundColor: "#1e1e1e", color: "#fff" }}>
              <Typography variant="h6">Réservations</Typography>
              <Typography variant="h3">{stats.bookings}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, backgroundColor: "#1e1e1e", color: "#fff" }}>
              <Typography variant="h6">Utilisateurs</Typography>
              <Typography variant="h3">{stats.users}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Actions rapides */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" color="success" onClick={() => navigate("/fields")}>
              Gérer Terrains
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" color="info" onClick={() => navigate("/admin/reservations")}>
              Gérer Réservations
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" color="warning" onClick={() => navigate("/admin/stats")}>
              Voir Statistiques
            </Button>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
