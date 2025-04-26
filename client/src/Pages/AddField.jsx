import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, MenuItem, Switch, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const surfaceOptions = ["Grass", "Turf", "Hard Court", "Clay", "Other"];

export default function AddField() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    sport: "",
    surfaceType: "",
    city: "",
    description: "",
    length: "",
    width: "",
    lights: false,
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSwitchChange = (e) => {
    setForm({ ...form, lights: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("sport", form.sport);
    formData.append("surfaceType", form.surfaceType);
    formData.append("description", form.description);
    formData.append("dimensions.length", form.length);
    formData.append("dimensions.width", form.width);
    formData.append("location.city", form.city);
    formData.append("lights", form.lights);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await axios.post("http://localhost:8000/fields", formData);
      toast.success("Terrain ajouté avec succès ✅");
      navigate("/fields");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout ❌");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, backgroundColor: "#1e1e1e", p: 4, borderRadius: 3 }}>
      <Typography variant="h4" mb={3} sx={{ color: "#fff", textAlign: "center" }}>
        ➕ Ajouter un Terrain
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Nom du terrain" name="name" fullWidth margin="normal" onChange={handleChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Sport" name="sport" fullWidth margin="normal" onChange={handleChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Longueur (m)" name="length" type="number" fullWidth margin="normal" onChange={handleChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Largeur (m)" name="width" type="number" fullWidth margin="normal" onChange={handleChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField select label="Type de surface" name="surfaceType" value={form.surfaceType} fullWidth margin="normal" onChange={handleChange} required InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }}>
          {surfaceOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Ville" name="city" fullWidth margin="normal" onChange={handleChange} InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
        <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={4} onChange={handleChange} InputProps={{ style: { color: "#fff" } }} InputLabelProps={{ style: { color: "#aaa" } }} />

        <FormControlLabel
          control={<Switch checked={form.lights} onChange={handleSwitchChange} color="success" />}
          label="🕯️ Lumières disponibles"
          sx={{ mt: 2 }}
        />

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          📷 Choisir une image
          <input type="file" hidden name="image" onChange={handleChange} />
        </Button>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button type="submit" variant="contained" color="success">
            💾 Ajouter
          </Button>
        </Box>
      </form>
    </Container>
  );
}
