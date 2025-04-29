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

export default function RegisterWithEmail() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    otp: "",
  });
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleRegister = async () => {
    if (!formData.password || formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        city: formData.city,
        phone: formData.phone,
      });
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error("Code incorrect ou expiré");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("/auth/resend-otp", {
        email: formData.email,
      });
      toast.success("📧 Nouveau code OTP envoyé !");
    } catch (err) {
      toast.error("❌ Impossible de renvoyer le code.");
    }
  };

  return (
    <Grid container sx={{ height: "100vh", width: "100%", margin: 0, overflow: "hidden" }}>
      
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
          px: 2,
        }}
      >
        <Card
          elevation={10}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 370,
            backgroundColor: "#1e1e1e",
            borderRadius: 4,
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 0 15px rgba(0,0,0,0.4)",
            transition: "transform 0.3s ease-in-out", // ✅ Animation fluide
            "&:hover": {
              transform: "scale(1.02)", // ✅ Grandit un peu au survol
            }
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#156D9D" }}>
            {step === 1 ? "Créer un compte" : "Vérifie ton e-mail"}
          </Typography>

          <Divider sx={{ my: 1, backgroundColor: "#156D9D" }} />

          {step === 1 ? (
            <>
              <TextField
                label="Nom d'utilisateur"
                name="username"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <TextField
                label="Adresse e-mail"
                name="email"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <TextField
                label="Mot de passe"
                name="password"
                type="password"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <TextField
                label="Ville"
                name="city"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <TextField
                label="Numéro de téléphone"
                name="phone"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1,
                  fontWeight: "bold",
                  backgroundColor: "#FF6B00",
                  "&:hover": {
                    backgroundColor: "#e65c00",
                  },
                }}
                onClick={handleRegister}
              >
                Créer le compte
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#FF6B00",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Se connecter
                </Link>
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                📧 Un code de vérification a été envoyé par e-mail.
              </Typography>
              <TextField
                label="Code OTP"
                name="otp"
                size="small"
                fullWidth
                onChange={handleChange}
                margin="dense"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#156D9D" } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1,
                  fontWeight: "bold",
                  backgroundColor: "#FF6B00",
                  "&:hover": {
                    backgroundColor: "#e65c00",
                  },
                }}
                onClick={handleVerifyOtp}
              >
                Vérifier
              </Button>
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1, color: "#FF6B00", fontWeight: "bold" }}
                onClick={handleResendOtp}
              >
                🔁 Renvoyer le code OTP
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#FF6B00",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Se connecter
                </Link>
              </Typography>
            </>
          )}
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
