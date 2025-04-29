import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { useAuth } from "./hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { data } = await axios.get("/auth/login/success", {
          withCredentials: true,
        });

        if (data?.user) {
          toast.success("✅ Connexion réussie !");
          setTimeout(() => navigate("/home"), 1500);
        }
      } catch (err) {
        toast.error("❌ Erreur lors de la connexion.");
        console.error(err);
      }
    };

    checkLogin();
  }, []);

  const handleGoogleLogin = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Formulaire à gauche */}
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
            👋 Connexion à ArenaGo
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
            Connecte-toi avec Google pour continuer
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#333" }} />

          <Button
            variant="contained"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: "#4285F4",
              py: 1.3,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#357ae8",
              },
            }}
          >
            Se connecter avec Google
          </Button>
        </Card>
      </Grid>

      {/* Image à droite */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: "url('/images/ArenaGo.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundColor: "#121212",
        }}
      />
    </Grid>
  );
}
