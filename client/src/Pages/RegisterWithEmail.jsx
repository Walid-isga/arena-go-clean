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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterWithEmail() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    otp: "",
  });
  const [step, setStep] = useState(1); // 1 = formulaire, 2 = otp
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
      const res = await axios.post("http://localhost:8000/auth/register", {
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
      const res = await axios.post("http://localhost:8000/auth/verify-otp", {
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
      await axios.post("http://localhost:8000/auth/resend-otp", {
        email: formData.email,
      });
      toast.success("📧 Nouveau code OTP envoyé !");
    } catch (err) {
      toast.error("❌ Impossible de renvoyer le code.");
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
            {step === 1 ? "Créer un compte" : "Vérifier l'e-mail"}
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#333" }} />

          {step === 1 ? (
            <>
              <TextField
                label="Nom d'utilisateur"
                name="username"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                label="Adresse e-mail"
                name="email"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                label="Mot de passe"
                name="password"
                type="password"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                label="Ville"
                name="city"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                label="Numéro de téléphone"
                name="phone"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, py: 1.3 }}
                onClick={handleRegister}
              >
                Créer le compte
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Un code de vérification a été envoyé à votre adresse e-mail.
              </Typography>
              <TextField
                label="Code OTP"
                name="otp"
                fullWidth
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, py: 1.3 }}
                onClick={handleVerifyOtp}
              >
                Vérifier le code
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
                onClick={handleResendOtp}
              >
                🔁 Renvoyer le code OTP
              </Button>
            </>
          )}
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
