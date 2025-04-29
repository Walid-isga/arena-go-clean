import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import "../styles/MonProfil.css"; // 🔥 Import du style spécial

export default function MonProfil() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    city: "",
    phone: "",
    password: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data;
        setUser(userData);
        setForm({
          username: userData.username || "",
          email: userData.email || "",
          city: userData.city || "",
          phone: userData.phone || "",
          password: "",
          picture: userData.picture || "",
        });
      } catch (err) {
        console.error("Erreur récupération utilisateur :", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("city", form.city);
      formData.append("phone", form.phone);
      if (form.password) {
        formData.append("password", form.password);
      }
      if (form.picture instanceof File) {
        formData.append("picture", form.picture);
      }

      await axios.patch(`http://localhost:8000/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updated = await axios.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updated.data);
      setForm({
        username: updated.data.username || "",
        email: updated.data.email || "",
        city: updated.data.city || "",
        phone: updated.data.phone || "",
        password: "",
        picture: updated.data.picture || "",
      });

      toast.success("✅ Profil mis à jour !");
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
      toast.error("❌ Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const getPictureUrl = () => {
    if (!form.picture) return null;
    if (form.picture instanceof File) {
      return URL.createObjectURL(form.picture);
    }
    if (typeof form.picture === "string" && form.picture.startsWith("/uploads")) {
      return `http://localhost:8000${form.picture}`;
    }
    return form.picture;
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement du profil...</p>;

  return (
    <Container maxWidth="sm" className="profile-container">
      <Paper elevation={4} className="profile-card">
        <Box textAlign="center">
          <Avatar
            src={getPictureUrl()}
            alt="avatar"
            className="profile-avatar"
          />

          <Typography className="profile-title">
            👤 Mon profil
          </Typography>
          <Typography className="profile-subtitle">
            Visualisez et mettez à jour vos informations personnelles
          </Typography>
        </Box>

        <Card className="profile-inner-card">
          <CardContent>
            <Grid container spacing={3}>
              {[
                { label: "Nom d'utilisateur", name: "username" },
                { label: "Email", name: "email" },
                { label: "Ville", name: "city" },
                { label: "Numéro de téléphone", name: "phone" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    className="profile-input"
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#666" } }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  className="profile-input"
                  label="Mot de passe (nouveau si modifié)"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#666" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  className="profile-upload-btn"
                >
                  📁 Choisir une image de profil
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, picture: e.target.files[0] }))
                    }
                  />
                </Button>
                {form.picture && (
                  <Typography className="profile-image-text">
                    {form.picture instanceof File ? form.picture.name : "Image actuelle"}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="profile-update-btn"
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "💾 Mettre à jour"
                  )}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}
