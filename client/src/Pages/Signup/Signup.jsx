import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { toast } from "react-toastify";
import axios from "../axiosConfig";

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const { data } = await axios.get("/auth/login/success", {
          withCredentials: true,
        });
        if (data?.user) {
          toast.success("✅ Inscription réussie !");
          setTimeout(() => navigate("/fields"), 1500);
        }
      } catch (err) {
        console.log(err);
        toast.error("❌ Une erreur est survenue après l'inscription !");
      }
    };

    checkGoogleAuth();
  }, []);

  const googleAuth = () => {
    window.open(`http://localhost:8000/auth/google/callback`, "_self");
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
        <Paper
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
          <LockPersonIcon sx={{ fontSize: 40, color: "#4FC3F7", mb: 1 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Créez votre compte
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#333" }} />

          <Button
            variant="contained"
            fullWidth
            onClick={googleAuth}
            sx={{
              backgroundColor: "#0b0b15",
              py: 1.2,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <img
              src="/images/google.png"
              alt="google icon"
              style={{ width: 20, height: 20 }}
            />
            <Typography variant="body1">S'inscrire avec Google</Typography>
          </Button>

          <Divider sx={{ my: 2, backgroundColor: "#333" }} />

          <Typography variant="body2">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" style={{ color: "#4FC3F7", textDecoration: "none" }}>
              Connexion
            </Link>
          </Typography>
        </Paper>
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

export default Signup;
