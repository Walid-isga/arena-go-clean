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
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/login/success", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setForm({
          username: res.data.user.username || "",
          email: res.data.user.email || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur", err);
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
      await axios.patch(`http://localhost:8000/users/${user._id}`, form);
      alert("Profil mis à jour !");
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <Box textAlign="center" mb={4}>
            <Avatar
              src={user.picture}
              alt="avatar"
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                border: "2px solid #4FC3F7",
              }}
            />
            <Typography variant="h5" mt={2} fontWeight="bold">
              👤 Mon profil
            </Typography>
            <Typography variant="body2" color="gray">
              Visualisez et mettez à jour vos informations personnelles
            </Typography>
          </Box>

          <Card
            sx={{
              backgroundColor: "#121212",
              color: "#fff",
              borderRadius: 2,
              border: "1px solid #333",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom d'utilisateur"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    variant="filled"
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    variant="filled"
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                  />
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
    </>
  );
}
