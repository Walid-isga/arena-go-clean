import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/auth/login/success", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("Erreur user :", err);
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/booking/status/pending");
      setPendingCount(res.data.length);
    } catch (err) {
      console.error("Erreur fetch pending bookings", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/auth/logout", {
        withCredentials: true, // essentiel pour détruire la session côté serveur
      });
  
      toast.success("Déconnecté !");
      setTimeout(() => {
        navigate("/login");
        window.location.reload(); // 🔁 recharge la page pour nettoyer l’état local
      }, 1000);
    } catch (error) {
      toast.error("Erreur lors de la déconnexion !");
    }
  
    handleClose();
  };  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.isAdmin) {
      fetchPendingBookings();
    }
  }, [location, user]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#121212",
        color: "#fff",
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #333",
      }}
    >
      {/* Logo + Titre */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Sportify
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ display: "flex", gap: 3 }}>
        {SidebarData.map((item, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton component={Link} to={item.path} sx={{ color: "#fff" }}>
              {item.icon}
              <ListItemText primary={item.title} sx={{ ml: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}

        {user.isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/fields" sx={{ color: "#fff" }}>
                <SportsSoccerIcon />
                <ListItemText primary="Terrains" sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/admin/reservations")} sx={{ color: "#fff" }}>
                <Badge badgeContent={pendingCount} color="error">
                  <NotificationsIcon />
                </Badge>
                <ListItemText primary="Réservations" sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* Avatar / Menu utilisateur */}
      <Box>
        <Avatar
          src={user.picture}
          alt={user.username}
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40,
            cursor: "pointer",
            border: "2px solid #4FC3F7",
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              backgroundColor: "#2a2a2a",
              color: "#fff",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem onClick={() => { navigate("/profile"); handleClose(); }}>
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: "#4FC3F7" }} />
            </ListItemIcon>
            Mon Profil
          </MenuItem>
          <Divider sx={{ backgroundColor: "#444" }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#f44336" }} />
            </ListItemIcon>
            Déconnexion
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
