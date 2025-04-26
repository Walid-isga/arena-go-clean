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
import axios from "axios";
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
  
      // ➡️ Redirection selon le type d'utilisateur
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
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#1e1e1e",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
        }}
      >
        <Card
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            backgroundColor: "#121212",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🔐 Connexion à Sportify
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
            Connecte-toi avec ton e-mail et mot de passe
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#333" }} />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.3, fontWeight: "bold" }}
            onClick={handleLogin}
          >
            Se connecter
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={{ color: "#4FC3F7", textDecoration: "none" }}>
              S'inscrire
            </Link>
          </Typography>
        </Card>
      </Grid>

      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: "url('/images/Sportify.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundColor: "#121212",
        }}
      />
    </Grid>
  );
}
