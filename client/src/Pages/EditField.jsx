
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

const surfaceOptions = ["Gazon", "Synthétique", "Béton", "Terre battue", "Autre"];

export default function EditField() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sport: "",
    surfaceType: "",
    city: "",
    description: "",
    length: "",
    width: "",
  });

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await axios.get(`/fields/${id}`);
        setForm({
          name: data.name || "",
          sport: data.sport || "",
          surfaceType: data.surfaceType || "",
          city: data.location?.city || "",
          description: data.description || "",
          length: data.dimensions?.length || "",
          width: data.dimensions?.width || "",
        });
      } catch (err) {
        console.error("Erreur fetch terrain:", err);
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
      await axios.put(`/fields/${id}`, {
        name: form.name,
        sport: form.sport,
        surfaceType: form.surfaceType,
        description: form.description,
        dimensions: { length: form.length, width: form.width },
        location: { city: form.city },
      });
      toast.success("✅ Terrain modifié !");
      navigate("/fields");
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur modification terrain !");
    }
  };

  const textFieldStyle = {
    "& label": { color: "#003566" },
    "& input": { color: "#003566" },
    "& textarea": { color: "#003566" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#003566" },
      "&:hover fieldset": { borderColor: "#FF6B00" },
      "&.Mui-focused fieldset": { borderColor: "#FF6B00" },
    },
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, backgroundColor: "#ffffff", p: 4, borderRadius: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" mb={4} color="#003566">
        ✏️ Modifier un Terrain
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Nom du terrain" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle} />
        <TextField label="Sport" name="sport" value={form.sport} onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle} />
        <TextField label="Longueur (m)" name="length" value={form.length} type="number" onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle} />
        <TextField label="Largeur (m)" name="width" value={form.width} type="number" onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle} />
        <TextField select label="Type de surface" name="surfaceType" value={form.surfaceType} onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle}>
          {surfaceOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Ville" name="city" value={form.city} onChange={handleChange} fullWidth margin="normal" required sx={textFieldStyle} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} margin="normal" sx={textFieldStyle} />

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button type="submit" variant="contained" sx={{
            backgroundColor: "#FF6B00",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s",
            "&:hover": { backgroundColor: "#e65c00", transform: "scale(1.02)" }
          }}>
            ✅ Sauvegarder
          </Button>
        </Box>
      </form>
    </Container>
  );
}
