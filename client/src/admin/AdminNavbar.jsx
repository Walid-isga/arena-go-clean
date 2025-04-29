import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "../axiosConfig";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
      const res = await axios.get("/booking/status/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingCount(res.data.length);
    } catch (err) {
      console.error("Erreur fetch réservations", err);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "#003566", fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/admin")}>
          🛡️ Admin - ArenaGo
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            onClick={() => navigate("/admin/reservations")}
            sx={{
              color: isActive("/admin/reservations") ? "#FF6B00" : "#003566",
              fontWeight: "bold",
              "&:hover": { color: "#FF6B00" },
            }}
          >
            <Badge badgeContent={pendingCount} color="error">
              <NotificationsIcon sx={{ mr: 1 }} />
              Réservations
            </Badge>
          </Button>

          <Button
            onClick={() => navigate("/fields")}
            sx={{
              color: isActive("/fields") ? "#FF6B00" : "#003566",
              fontWeight: "bold",
              "&:hover": { color: "#FF6B00" },
            }}
          >
            Terrains
          </Button>

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              color: "#FF6B00",
              borderColor: "#FF6B00",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#ff6b0020" },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
