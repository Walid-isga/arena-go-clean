// client/src/Components/AddFieldModal.jsx
import React, { useState } from "react";
import {
  Box, Button, Modal, TextField, Switch, FormControlLabel,
  Grid, Typography
} from "@mui/material";
import axios from "../axiosConfig";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%", maxWidth: 600, bgcolor: "#1e1e1e",
  color: "#fff", borderRadius: 3, boxShadow: 24, p: 4,
};

export default function AddFieldModal({ open, handleClose, handleSuccess }) {
  const [fieldData, setFieldData] = useState({
    name: "", sport: "", surfaceType: "", city: "", description: "", lights: false,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setFieldData((prev) => ({ ...prev, [name]: checked }));
  };

  const resetData = () => {
    setFieldData({ name: "", sport: "", surfaceType: "", city: "", description: "", lights: false });
    setImage(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(fieldData).forEach(key => {
        form.append(key, fieldData[key]);
      });
      if (image) form.append("image", image);

      await axios.post("http://localhost:8000/fields", form, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>➕ Ajouter un terrain</Typography>
        <Grid container spacing={2}>
          {["name", "sport", "surfaceType", "city"].map((field, i) => (
            <Grid item xs={12} key={i}>
              <TextField
                fullWidth variant="filled" label={field}
                name={field} value={fieldData[field]}
                onChange={handleChange}
                sx={{ backgroundColor: "#2a2a2a", borderRadius: 1, input: { color: "#fff" }, label: { color: "#aaa" } }}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={3}
              label="Description" name="description"
              value={fieldData.description} onChange={handleChange}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1, input: { color: "#fff" }, label: { color: "#aaa" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={fieldData.lights} onChange={handleSwitch} name="lights" />}
              label="💡 Lumières" sx={{ color: "#ccc" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="outlined" component="label">
              📁 Choisir une image
              <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Button>
            {image && <Typography variant="caption" sx={{ mt: 1 }}>{image.name}</Typography>}
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: "#4CAF50" }}>
              💾 Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
