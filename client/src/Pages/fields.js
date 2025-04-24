import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Container,
  TextField,
  MenuItem,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import AddFieldModel from "../Components/AddFieldModel";

function Fields() {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [filteredFields, setFilteredFields] = useState([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  const getFields = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/fields");
      setFields(data);
      setFilteredFields(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFields();
  }, []);

  const uniqueSports = [...new Set(fields.map((f) => f.sport))];

  const filterFields = () => {
    const filtered = fields.filter((field) => {
      const matchSport = sportFilter === "" || field.sport === sportFilter;
      const matchSearch = field.name.toLowerCase().includes(search.toLowerCase());
      return matchSport && matchSearch;
    });
    setFilteredFields(filtered);
  };

  useEffect(() => {
    filterFields();
  }, [search, sportFilter]);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        🏟️ Liste des Terrains
      </Typography>

      {/* Filtrage */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <TextField
          label="🔍 Rechercher par nom"
          variant="filled"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "#2a2a2a",
            input: { color: "#fff" },
            label: { color: "#aaa" },
            flex: 1,
            borderRadius: 1,
          }}
        />
        <TextField
          select
          label="Filtrer par sport"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          variant="filled"
          sx={{
            minWidth: 200,
            backgroundColor: "#2a2a2a",
            input: { color: "#fff" },
            label: { color: "#aaa" },
            borderRadius: 1,
          }}
        >
          <MenuItem value="">Tous les sports</MenuItem>
          {uniqueSports.map((sport, index) => (
            <MenuItem key={index} value={sport}>
              {sport}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grille des terrains */}
      <Grid container spacing={3}>
        {filteredFields.map((field, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: "#4FC3F7" }}>
                  {field.name}
                </Typography>
                <Typography variant="body2">
                  <strong>🏅 Sport :</strong> {field.sport}
                </Typography>
                <Typography variant="body2">
                  <strong>🟫 Surface :</strong> {field.surfaceType}
                </Typography>
                <Typography variant="body2">
                  <strong>📍 Ville :</strong> {field.location.city}
                </Typography>
                {field.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {field.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                <Button variant="contained" size="small" sx={{ backgroundColor: "#4CAF50" }}>
                  Réserver
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bouton flottant pour ajouter un terrain */}
      <Box onClick={() => setOpen(true)} sx={{ position: "fixed", bottom: 30, right: 30 }}>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>

      {/* Modal pour ajout */}
      <AddFieldModel
        open={open}
        handleClose={() => setOpen(false)}
        handleSuccess={() => {
          getFields();
          setOpen(false);
        }}
      />
    </Container>
  );
}

export default Fields;
