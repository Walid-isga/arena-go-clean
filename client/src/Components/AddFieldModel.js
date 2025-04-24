import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "#1e1e1e",
  color: "#fff",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function AddFieldModal({ open, handleClose, handleSuccess }) {
  const [fieldName, setFieldName] = useState("");
  const [fieldSport, setFieldSport] = useState("");
  const [fieldLength, setFieldLength] = useState("");
  const [fieldWidth, setFieldWidth] = useState("");
  const [surfaceType, setSurfaceType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lights, setLights] = useState(false);
  const [seating, setSeating] = useState(false);
  const [changingRoom, setChangingRoom] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);

  const resetData = () => {
    setFieldName("");
    setFieldSport("");
    setFieldLength("");
    setFieldWidth("");
    setSurfaceType("");
    setCity("");
    setState("");
    setCountry("");
    setLights(false);
    setSeating(false);
    setChangingRoom(false);
    setContactEmail("");
    setPhoneNumber("");
    setAlternativePhoneNumber("");
    setDescription("");
    setRating(5);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fieldData = {
        name: fieldName,
        sport: fieldSport,
        dimensions: { length: fieldLength, width: fieldWidth },
        surfaceType,
        location: { city, state, country },
        lights,
        amenities: { seating, changing_room: changingRoom },
        bookingInfo: { contactEmail, phoneNumber, alternativePhoneNumber },
        description,
        rating,
      };

      await axios.post("http://localhost:8000/fields", fieldData, {
        withCredentials: true,
      });
      handleSuccess();
      resetData();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={() => handleClose(false)}>
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ➕ Ajouter un terrain
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom du terrain"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              variant="filled"
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sport"
              value={fieldSport}
              onChange={(e) => setFieldSport(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Longueur"
              value={fieldLength}
              onChange={(e) => setFieldLength(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Largeur"
              value={fieldWidth}
              onChange={(e) => setFieldWidth(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Type de surface"
              value={surfaceType}
              onChange={(e) => setSurfaceType(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Région"
              value={state}
              onChange={(e) => setState(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Pays"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch checked={lights} onChange={(e) => setLights(e.target.checked)} />
              }
              label="💡 Lumières"
              sx={{ color: "#ccc" }}
            />
            <FormControlLabel
              control={
                <Switch checked={seating} onChange={(e) => setSeating(e.target.checked)} />
              }
              label="🪑 Places assises"
              sx={{ color: "#ccc" }}
            />
            <FormControlLabel
              control={
                <Switch checked={changingRoom} onChange={(e) => setChangingRoom(e.target.checked)} />
              }
              label="🚿 Vestiaires"
              sx={{ color: "#ccc" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Téléphone secondaire"
              value={alternativePhoneNumber}
              onChange={(e) => setAlternativePhoneNumber(e.target.value)}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="filled"
              multiline
              rows={3}
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              inputProps={{ min: 1, max: 10 }}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => {
              resetData();
              handleClose(false);
            }}
            sx={{
              backgroundColor: "#555",
              "&:hover": { backgroundColor: "#777" },
              mr: 2,
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            sx={{
              backgroundColor: "#54B435",
              "&:hover": { backgroundColor: "#69e042" },
            }}
          >
            Ajouter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
