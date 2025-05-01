import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Box,
  Badge,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosConfig";
import { SidebarData } from "./SidebarData";
import { getImageUrl } from "../utils/getImageUrl";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [pendingCount, setPendingCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const avatarMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/booking/status/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCount(res.data.length);
      } catch (err) {
        console.error("Erreur chargement réservations", err);
      }
    };

    if (user?.isAdmin) {
      fetchPending();
    }
  }, [location, user]);

  if (!user) return null;

  const getPictureUrl = () => {
    if (!user.picture) return null;
    if (typeof user.picture === "string") {
      return getImageUrl(user.picture.replace("/uploads/", ""));
    }
    return user.picture;
  };

  const handleLogout = () => {
    logout();
    toast.success("✅ Déconnecté !");
    navigate("/landing");
    handleCloseAvatarMenu();
  };

  const handleOpenAvatarMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseAvatarMenu = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const links = [
    ...SidebarData,
    { title: "Terrains", path: "/fields", icon: <SportsSoccerIcon /> },
  ];

  if (user?.isAdmin) {
    links.push({
      title: `Réservations (${pendingCount})`,
      path: "/admin/reservations",
      icon: (
        <Badge badgeContent={pendingCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
    });
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#003566" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo ArenaGo */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            ArenaGo
          </Typography>

          {/* Desktop Links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3 }}>
              {links.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={i}
                    to={item.path}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        color: isActive ? "#FFA500" : "#003566",
                        fontWeight: "bold",
                        fontFamily: "Poppins",
                        pb: "4px",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: isActive ? "100%" : "0%",
                          height: "2px",
                          left: 0,
                          bottom: 0,
                          backgroundColor: "#FFA500",
                          transition: "width 0.3s ease-in-out",
                        },
                        "&:hover::after": {
                          width: "100%",
                        },
                        "&:hover": {
                          color: "#FFA500",
                        },
                        transition: "color 0.3s",
                      }}
                    >
                      {item.title}
                    </Box>
                  </Link>
                );
              })}
            </Box>
          )}

          {/* Avatar + Burger Mobile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
            <Avatar
              src={getPictureUrl()}
              alt={user.username}
              onClick={handleOpenAvatarMenu}
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Avatar */}
      <Menu
        anchorEl={anchorEl}
        open={avatarMenuOpen}
        onClose={handleCloseAvatarMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/monprofil");
            handleCloseAvatarMenu();
          }}
          sx={{
            fontWeight: "bold",
            color: "#003566",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 0,
              height: "2px",
              bottom: 0,
              left: 0,
              backgroundColor: "#FFA500",
              transition: "width 0.3s ease-in-out",
            },
            "&:hover": {
              color: "#FFA500",
              "&::after": { width: "100%" },
            },
          }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          Mon Profil
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            fontWeight: "bold",
            color: "#003566",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 0,
              height: "2px",
              bottom: 0,
              left: 0,
              backgroundColor: "#FFA500",
              transition: "width 0.3s ease-in-out",
            },
            "&:hover": {
              color: "#FFA500",
              "&::after": { width: "100%" },
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Drawer Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            {links.map((item, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  {item.icon}
                  <ListItemText sx={{ ml: 1 }} primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
