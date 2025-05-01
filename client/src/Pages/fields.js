import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import AdminNavbar from "../admin/AdminNavbar";
import { getImageUrl } from "../utils/getImageUrl";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Récupération des terrains
  const fetchFields = async () => {
    try {
      const { data } = await axios.get("/fields");
      setFields(data);
    } catch (err) {
      console.error("Erreur de chargement des terrains :", err);
    }
  };

  // Suppression
  const deleteField = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce terrain ?")) return;
    try {
      await axios.delete(`/fields/${id}`);
      fetchFields();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return (
    <>
      {user?.isAdmin && <AdminNavbar />}

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
          🏟️ Nos Terrains Disponibles
        </Typography>

        {user?.isAdmin && (
          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/admin/add-field")}
            >
              ➕ Ajouter un Terrain
            </Button>
          </Box>
        )}

        <Grid container spacing={3}>
          {fields.map((field) => {
            const rawPhoto = field.photos?.[0] || ""; // sécurité
            const imageUrl = rawPhoto
            ? `https://arena-go-clean-production.up.railway.app/uploads/${rawPhoto.replace(/^uploads[\\/]+/, "")}`
            : "https://via.placeholder.com/400x200?text=Pas+de+photo";
          

            return (
              <Grid item xs={12} sm={6} md={4} key={field._id}>
                <Card
                  sx={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    "&:hover .overlay": {
                      opacity: 1,
                      transform: "rotateY(0deg)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={field.name}
                    sx={{
                      transition: "transform 0.8s",
                      transform: "rotateY(0deg)",
                      "&:hover": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  />

                  {/* Boutons overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "all 0.5s ease",
                      transform: "rotateY(90deg)",
                    }}
                  >
                    {user?.isAdmin ? (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={() => navigate(`/admin/edit-field/${field._id}`)}
                          sx={{ mb: 1 }}
                        >
                          ✏️ Modifier
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => deleteField(field._id)}
                        >
                          🗑️ Supprimer
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={() => navigate(`/field/${field._id}`)}
                          sx={{ mb: 1 }}
                        >
                          🔍 Détails
                        </Button>
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => navigate("/booking")}
                        >
                          🏟️ Réserver
                        </Button>
                      </>
                    )}
                  </Box>

                  {/* Infos terrain */}
                  <CardContent>
                    <Typography variant="h6">{field.name}</Typography>
                    <Typography variant="body2" color="gray">
                      {field.location?.city || "Ville inconnue"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
