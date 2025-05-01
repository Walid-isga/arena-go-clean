import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import NavbarLanding from "../Components/NavbarLanding";
import FooterLanding from "../Components/FooterLanding";
import { getImageUrl } from "../utils/getImageUrl";
import {
  Container,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Grid,
  Paper,
} from "@mui/material";

export default function PublicFieldDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await axios.get(`/fields/${id}`);
        setField(data);
      } catch (err) {
        console.error("❌ Erreur récupération terrain :", err);
      }
    };
    fetchField();
  }, [id]);

  if (!field) {
    return (
      <Container sx={{ mt: 12, textAlign: "center", color: "#003566" }}>
        Chargement des détails du terrain...
      </Container>
    );
  }

  return (
    <>
      <NavbarLanding />

      <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {/* ✅ Image responsive et bien affichée */}
          {field.photos?.[0] && (
            <Box sx={{ width: "100%", height: { xs: 220, sm: 300 }, overflow: "hidden" }}>
              <img
                src={`https://arena-go-clean-production.up.railway.app/uploads/${field.photos[0].replace(/^uploads[\\/]+/, "")}`}
                alt={field.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* ✅ Contenu du terrain */}
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" color="#003566" fontWeight="bold" mb={2}>
              {field.name}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><strong>📍 Ville :</strong> {field.location?.city || "Non précisé"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>🏅 Sport :</strong> {field.sport}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>🌱 Surface :</strong> {field.surfaceType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>📏 Dimensions :</strong> {field.dimensions?.length}m x {field.dimensions?.width}m
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mt: 2 }}>
                  <strong>📝 Description :</strong><br />
                  {field.description || "Aucune description fournie pour ce terrain."}
                </Typography>
              </Grid>
            </Grid>

            {/* ✅ Optionnel : Lumières */}
            {field.lights && (
              <Chip
                label="💡 Lumières disponibles"
                color="success"
                variant="filled"
                sx={{ mt: 3 }}
              />
            )}

            {/* ✅ Bouton Réserver */}
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  background: "linear-gradient(to right, #FF6B00, #ff8c1a)",
                  color: "#fff",
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    background: "#e65c00",
                  },
                }}
              >
                🏟️ Réserver ce terrain
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <FooterLanding />
    </>
  );
}
