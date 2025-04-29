import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import AdminLayout from "./AdminLayout";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ fields: 0, bookings: 0, users: 0 });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/admin/stats");
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#003566" }}>
          🎛️ Dashboard Administrateur
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            { label: "Terrains", value: stats.fields },
            { label: "Réservations", value: stats.bookings },
            { label: "Utilisateurs", value: stats.users },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                <Paper elevation={4} sx={{ p: 3, backgroundColor: "#ffffff", color: "#003566", borderRadius: 3 }}>
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography variant="h3">{item.value}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" sx={{ backgroundColor: "#FF6B00", color: "#fff", "&:hover": { backgroundColor: "#e65c00" } }} onClick={() => navigate("/fields")}>
              Gérer Terrains
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" sx={{ backgroundColor: "#003566", color: "#fff", "&:hover": { backgroundColor: "#002244" } }} onClick={() => navigate("/admin/reservations")}>
              Gérer Réservations
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" sx={{ backgroundColor: "#28a745", color: "#fff", "&:hover": { backgroundColor: "#218838" } }} onClick={() => navigate("/admin/stats")}>
              Voir Statistiques
            </Button>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
