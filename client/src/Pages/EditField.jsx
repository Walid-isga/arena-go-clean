import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const surfaceOptions = ["Grass", "Turf", "Hard Court", "Clay", "Other"];

export default function EditField() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sport: "",
    length: "",
    width: "",
    surfaceType: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/fields/${id}`);
        setForm({
          name: data.name || "",
          sport: data.sport || "",
          length: data.dimensions?.length || "",
          width: data.dimensions?.width || "",
          surfaceType: data.surfaceType || "",
          city: data.location?.city || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("Erreur de chargement du terrain :", err);
      }
    };

    fetchField();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/fields/${id}`, {
        name: form.name,
        sport: form.sport,
        surfaceType: form.surfaceType,
        description: form.description,
        dimensions: { length: form.length, width: form.width },
        location: { city: form.city },
      });
      toast.success("Terrain modifié avec succès ✅");
      navigate("/fields");
    } catch (err) {
      console.error("Erreur de modification :", err);
      toast.error("Erreur lors de la modification ❌");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, backgroundColor: "#1e1e1e", p: 4, borderRadius: 3 }}>
      <Typography variant="h4" mb={3} sx={{ color: "#fff", textAlign: "center" }}>
        ✏️ Modifier Terrain
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Nom du terrain" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Sport" name="sport" value={form.sport} onChange={handleChange} fullWidth margin="normal" required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Longueur (m)" name="length" type="number" value={form.length} onChange={handleChange} fullWidth margin="normal" required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Largeur (m)" name="width" type="number" value={form.width} onChange={handleChange} fullWidth margin="normal" required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField select label="Type de surface" name="surfaceType" value={form.surfaceType} onChange={handleChange} fullWidth margin="normal" required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }}>
          {surfaceOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        <TextField label="Ville" name="city" value={form.city} onChange={handleChange} fullWidth margin="normal" InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            ✅ Enregistrer
          </Button>
        </Box>
      </form>
    </Container>
  );
}
