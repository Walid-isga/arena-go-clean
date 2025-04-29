import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
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
import axios from "../axiosConfig";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/booking/status/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingCount(res.data.length);
    } catch (err) {
      console.error("Erreur fetch pending bookings", err);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("✅ Déconnecté !");
    navigate("/login");
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchPendingBookings();
    }
  }, [location, user]);

  if (!user) return null;

  const getPictureUrl = () => {
    if (!user || !user.picture) return null;
    if (typeof user.picture === "string" && user.picture.startsWith("/uploads")) {
      return `${user.picture}`;
    }
    return user.picture;
  };
  

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        color: "#003566",
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo ArenaGo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
            cursor: "pointer",
            fontSize: "1.8rem",
            color: "#003566",
            position: "relative",
            "&:hover": {
              color: "#FF6B00",
              transition: "0.3s",
            },
            "&::after": {
              content: "''",
              position: "absolute",
              width: "0",
              height: "3px",
              bottom: 0,
              left: 0,
              backgroundColor: "#FF6B00",
              transition: "width 0.3s",
            },
            "&:hover::after": {
              width: "100%",
            },
          }}
          onClick={() => navigate("/home")}
        >
          ArenaGo
        </Typography>
      </Box>

      {/* Liens Navigation */}
      <List sx={{ display: "flex", gap: 2 }}>
        {SidebarData.map((item, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "10px",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {item.icon}
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  sx: {
                    ml: 1,
                    color: "#003566",
                    fontWeight: "bold",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1rem",
                    position: "relative",
                    transition: "color 0.3s",
                    "&:hover": {
                      color: "#FF6B00",
                    },
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      width: "0",
                      height: "2px",
                      bottom: -3,
                      left: 0,
                      backgroundColor: "#FF6B00",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Bouton Terrains */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/fields"
            sx={{
              borderRadius: "10px",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                transform: "scale(1.05)",
              },
            }}
          >
            <SportsSoccerIcon sx={{ color: "#003566" }} />
            <ListItemText
              primary="Terrains"
              primaryTypographyProps={{
                sx: {
                  ml: 1,
                  color: "#003566",
                  fontWeight: "bold",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1rem",
                  position: "relative",
                  transition: "color 0.3s",
                  "&:hover": {
                    color: "#FF6B00",
                  },
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    width: "0",
                    height: "2px",
                    bottom: -3,
                    left: 0,
                    backgroundColor: "#FF6B00",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Bouton Réservations (admin seulement) */}
        {user.isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/admin/reservations")}
              sx={{
                borderRadius: "10px",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Badge badgeContent={pendingCount} color="error">
                <NotificationsIcon sx={{ color: "#003566" }} />
              </Badge>
              <ListItemText
                primary="Réservations"
                primaryTypographyProps={{
                  sx: {
                    ml: 1,
                    color: "#003566",
                    fontWeight: "bold",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1rem",
                    position: "relative",
                    transition: "color 0.3s",
                    "&:hover": {
                      color: "#FF6B00",
                    },
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      width: "0",
                      height: "2px",
                      bottom: -3,
                      left: 0,
                      backgroundColor: "#FF6B00",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* Avatar utilisateur */}
      <Box>
        <Avatar
          src={getPictureUrl()}
          alt={user.username}
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40,
            cursor: "pointer",
            border: "2px solid #5BB0D8",
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.1)",
            },
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
              backgroundColor: "#ffffff",
              color: "#003566",
              borderRadius: 2,
              boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            },
          }}
        >
          <MenuItem
            onClick={() => { navigate("/profile"); handleClose(); }}
            sx={{
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                color: "#FF6B00",
              },
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: "#FF6B00" }} />
            </ListItemIcon>
            Mon Profil
          </MenuItem>
          <Divider sx={{ backgroundColor: "#e0e0e0" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                color: "#FF6B00",
              },
            }}
          >
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
