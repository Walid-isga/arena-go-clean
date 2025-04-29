import React, { useState } from "react";
import {
  Button,
  Card,
  Typography,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", formData);
      const { token, user } = res.data;

      if (!token || !user) {
        toast.error("❌ Identifiants incorrects ou utilisateur non vérifié.");
        return;
      }

      localStorage.setItem("token", token);
      setUser(user);
      toast.success("✅ Connexion réussie !");
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Erreur lors de la connexion.");
    }
  };

  return (
    <Grid container sx={{ height: "100vh", width: "100%", margin: 0 }}>
      
      {/* Partie Formulaire */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, md: 6 },
        }}
      >
        <Card
          elevation={10}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#1e1e1e",
            borderRadius: 5,
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#156D9D" }}>
            Connexion à ArenaGo
          </Typography>

          <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
            Connecte-toi avec ton e-mail et mot de passe
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#156D9D" }} />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#156D9D" } }}
          />
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            fullWidth
            margin="dense"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#156D9D" } }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.3,
              fontWeight: "bold",
              backgroundColor: "#FF6B00",
              "&:hover": {
                backgroundColor: "#e65c00",
              },
            }}
            onClick={handleLogin}
          >
            Se connecter
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={{ color: "#FF6B00", fontWeight: "bold", textDecoration: "none" }}>
              S'inscrire
            </Link>
          </Typography>
        </Card>
      </Grid>

      {/* Partie Logo ArenaGo */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/Arenago.png"
          alt="ArenaGo Logo"
          style={{
            maxWidth: "65%",
            maxHeight: "85vh",
            height: "auto",
            animation: "float 3s ease-in-out infinite",
          }}
        />
      </Grid>
    </Grid>
  );
}
