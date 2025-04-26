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
} from "@mui/material";
import axios from "axios";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/users/me", {
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

      // 🔥 Recharge les données utilisateur après mise à jour
      const updated = await axios.get("http://localhost:8000/users/me", {
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

      alert("✅ Profil mis à jour !");
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
      alert("❌ Erreur lors de la mise à jour.");
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
  

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
        <Avatar
          src={getPictureUrl()}
          alt="avatar"
          sx={{ width: 100, height: 100, margin: "0 auto", border: "2px solid #4FC3F7" }}
        />

          <Typography variant="h5" mt={2} fontWeight="bold">
            👤 Mon profil
          </Typography>
          <Typography variant="body2" color="gray">
            Visualisez et mettez à jour vos informations personnelles
          </Typography>
        </Box>

        <Card sx={{ backgroundColor: "#121212", color: "#fff", borderRadius: 2 }}>
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
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    variant="filled"
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mot de passe (nouveau si modifié)"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  variant="filled"
                  sx={{ input: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#aaa" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
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
                  <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                    {form.picture instanceof File ? form.picture.name : "Image actuelle"}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ backgroundColor: "#4CAF50" }}
                >
                  💾 Mettre à jour
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}
