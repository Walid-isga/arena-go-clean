import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Statistiques", icon: <AssessmentIcon />, path: "/admin/stats" },
    { text: "Réservations", icon: <EventNoteIcon />, path: "/admin/reservations" },
    { text: "Terrains", icon: <SportsSoccerIcon />, path: "/fields" },
  ];

  return (
    <>
      <Box sx={{ p: 1.5, backgroundColor: "#003566", display: "flex", alignItems: "center" }}>
        <IconButton onClick={toggleDrawer} sx={{ color: "#fff" }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: "#fff", ml: 1, fontWeight: "bold" }}>
          Bienvenu
        </Typography>
      </Box>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2, backgroundColor: "#f9f9f9", height: "100%" }}>
          <Box textAlign="center" mb={2}>
            <Avatar
              src="/images/admin-avatar.png"
              sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: "#003566", fontWeight: "bold" }}>
              Admin ArenaGo
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List>
            {menuItems.map((item, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? "#FF6B00" : "#003566",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#eeeeee",
                    },
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 2 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mt: 2 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              sx={{
                color: "#f44336",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#ffe6e6",
                },
              }}
            >
              <LogoutIcon />
              <ListItemText primary="Déconnexion" sx={{ ml: 2 }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
}
