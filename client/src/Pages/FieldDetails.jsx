import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardMedia, CardContent, Button, Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FieldDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/fields/${id}`);
        setField(data);
      } catch (error) {
        console.error("Erreur de chargement du terrain :", error);
      }
    };

    fetchField();
  }, [id]);

  if (!field) {
    return (
      <Container sx={{ mt: 5, color: "#fff" }}>
        Chargement...
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 3, overflow: "hidden" }}>
        
        {/* ✅ Afficher l'image seulement s'il existe une photo */}
        {field.photos?.length > 0 && (
          <CardMedia
            component="img"
            height="250"
            image={`http://localhost:8000/${field.photos[0]}`}
            alt={field.name}
            sx={{
              objectFit: "cover",
            }}
          />
        )}

        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            {field.name}
          </Typography>

          <Divider sx={{ my: 2, bgcolor: "#555" }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">
              🏀 <strong>Sport :</strong> {field.sport || "Non spécifié"}
            </Typography>
            <Typography variant="h6">
              🌱 <strong>Surface :</strong> {field.surfaceType || "Non spécifié"}
            </Typography>
            <Typography variant="h6">
              📏 <strong>Dimensions :</strong> {field.dimensions?.length}m x {field.dimensions?.width}m
            </Typography>
            <Typography variant="h6">
              📍 <strong>Ville :</strong> {field.location?.city || "Non spécifiée"}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              📝 <strong>Description :</strong> {field.description || "Pas de description disponible."}
            </Typography>
          </Box>

          {/* Bouton réserver */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" color="success" onClick={() => navigate("/booking")}>
              🏟️ Réserver ce terrain
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
