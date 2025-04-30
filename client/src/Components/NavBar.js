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
    navigate("/login");
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
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#003566" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
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
            {links.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#003566",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                {item.title}
              </Link>
            ))}
          </Box>
        )}

        {/* Avatar + Burger */}
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

        {/* Menu Avatar */}
        <Menu
          anchorEl={anchorEl}
          open={avatarMenuOpen}
          onClose={handleCloseAvatarMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/monprofil");
              handleCloseAvatarMenu();
            }}
          >
            <AccountCircleIcon sx={{ mr: 1 }} />
            Mon Profil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Déconnexion
          </MenuItem>
        </Menu>
      </Toolbar>

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
    </AppBar>
  );
}
