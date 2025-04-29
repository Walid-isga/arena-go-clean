import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

const surfaceOptions = ["Gazon", "Synthétique", "Béton", "Terre battue", "Autre"];

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
    const { name, value, files } = e.target;
    if (name === "image") {
      console.log("✅ Image sélectionnée :", files[0]);
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSwitchChange = (e) => {
    setForm({ ...form, lights: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) {
      if (key === "image" && form.image) {
        formData.append("image", form.image);
      } else {
        formData.append(key, form[key]);
      }
    }

    console.log("📤 Données envoyées :");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await axios.post("/fields", formData);
      toast.success("✅ Terrain ajouté !");
      navigate("/fields");
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout :", err);
      toast.error("❌ Erreur ajout terrain !");
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
        ➕ Ajouter un Terrain
      </Typography>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField label="Nom du terrain" name="name" onChange={handleChange} required fullWidth margin="normal" sx={textFieldStyle} />
        <TextField label="Sport" name="sport" onChange={handleChange} required fullWidth margin="normal" sx={textFieldStyle} />
        <TextField label="Longueur (m)" name="length" type="number" onChange={handleChange} required fullWidth margin="normal" sx={textFieldStyle} />
        <TextField label="Largeur (m)" name="width" type="number" onChange={handleChange} required fullWidth margin="normal" sx={textFieldStyle} />

        <TextField
          select
          label="Type de surface"
          name="surfaceType"
          value={form.surfaceType}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          sx={textFieldStyle}
        >
          {surfaceOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Ville" name="city" onChange={handleChange} required fullWidth margin="normal" sx={textFieldStyle} />
        <TextField label="Description" name="description" multiline rows={3} onChange={handleChange} fullWidth margin="normal" sx={textFieldStyle} />

        <FormControlLabel
          control={<Switch color="primary" checked={form.lights} onChange={handleSwitchChange} />}
          label="🕯️ Lumières disponibles"
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              borderColor: "#28a745",
              color: "#28a745",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e6ffe6",
                borderColor: "#28a745",
              },
            }}
          >
            📷 Choisir une image
            <input type="file" name="image" hidden onChange={handleChange} accept="image/*" />
          </Button>
        </Box>

        <Button
          type="submit"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: "#FF6B00",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s",
            "&:hover": {
              backgroundColor: "#e65c00",
              transform: "scale(1.02)",
            },
          }}
        >
          💾 Ajouter Terrain
        </Button>
      </form>
    </Container>
  );
}
