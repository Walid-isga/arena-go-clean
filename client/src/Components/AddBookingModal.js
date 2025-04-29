import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "../axiosConfig";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "#ffffff",
  color: "#003566",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

export default function AddBookingModal({
  handleSuccess,
  handleError,
  open,
  handleSubmit,
  selectedInfo,
}) {
  const { user } = useAuth();
  const [fieldInfo, setFieldInfo] = useState(null);
  const [date, setDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndtime] = useState();
  const [players, setPlayers] = useState(0);
  const [teamName, setTeamName] = useState("");

  // 🔵 Charger infos terrain sélectionné
  useEffect(() => {
    const fetchFieldInfo = async () => {
      if (selectedInfo?.field) {
        try {
          const { data } = await axios.get(`http://localhost:8000/fields/${selectedInfo.field}`);
          setFieldInfo(data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchFieldInfo();
  }, [selectedInfo]);

  useEffect(() => {
    if (selectedInfo) {
      setDate(selectedInfo.date ? dayjs(selectedInfo.date) : null);
      setStarttime(selectedInfo.starttime ? dayjs(`2023-01-01T${selectedInfo.starttime}`) : null);
      setEndtime(selectedInfo.endtime ? dayjs(`2023-01-01T${selectedInfo.endtime}`) : null);
    }
  }, [selectedInfo]);

  const handleClose = () => {
    handleSubmit(false);
    resetForm();
  };

  const resetForm = () => {
    setDate(null);
    setStarttime(null);
    setEndtime(null);
    setPlayers(0);
    setTeamName("");
    setFieldInfo(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      toast.error("❌ Utilisateur non connecté !");
      return;
    }
    try {
      await axios.post("http://localhost:8000/booking", {
        user: user._id,
        field: selectedInfo.field,
        status: "Pending",
        date: date.format("YYYY-MM-DD"),
        starttime: starttime.format("HH:mm"),
        endtime: endtime.format("HH:mm"),
        teamName,
        players,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✅ Réservation enregistrée !");
      handleSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Erreur lors de la réservation !");
      handleError(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📝 Nouvelle Réservation
        </Typography>

        {fieldInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Terrain sélectionné :
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#003566">
              {fieldInfo.name}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de l'équipe"
              variant="outlined"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              InputLabelProps={{ style: { color: "#777" } }}    // ✅ ajoute ceci pour changer la couleur du label
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                input: { color: "#003566" },                    // ✅ texte en bleu ArenaGo
              }}
            />

          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de joueurs"
              variant="outlined"
              type="number"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, input: { color: "#003566" }, label: { color: "#777" },}}
            />
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  input: { color: "#003566" },  // ✅ le texte est bleu ArenaGo
                  label: { color: "#777" },      // label un peu gris clair
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Heure de début"
                value={starttime}
                ampm={false}
                onChange={(newValue) => setStarttime(newValue)}
                sx={{
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  input: { color: "#003566" },  // ✅ le texte est bleu ArenaGo
                  label: { color: "#777" },      // label un peu gris clair
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Heure de fin"
                value={endtime}
                ampm={false}
                onChange={(newValue) => setEndtime(newValue)}
                sx={{
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  input: { color: "#003566" },  // ✅ le texte est bleu ArenaGo
                  label: { color: "#777" },      // label un peu gris clair
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ color: "#003566", borderColor: "#003566", mr: 2 }}>
            Annuler
          </Button>
          <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: "#FF6B00" }}>
            Réserver
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
