import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ pour afficher le toast visuel

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8000/booking/status/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newPendingCount = res.data.length;

      // ✅ Si une nouvelle réservation a été faite (nombre plus grand)
      if (newPendingCount > pendingCount) {
        toast.info("🔔 Nouvelle réservation reçue !");
      }

      setPendingCount(newPendingCount);
    } catch (err) {
      console.error("Erreur récupération réservations pending", err);
    }
  };

  useEffect(() => {
    fetchPendingBookings(); // au premier chargement

    // ✅ puis actualiser toutes les 30 secondes
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#121212", mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" onClick={() => navigate("/admin")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
          🎛️ Admin - Sportify
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/admin/reservations")}>
            <Badge badgeContent={pendingCount} color="error">
              Réservations
            </Badge>
          </Button>
          <Button color="inherit" onClick={() => navigate("/fields")}>
            Terrains
          </Button>
          <Button color="error" variant="outlined" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
