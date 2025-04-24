
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterFields from "../Components/FilterFields";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "#1e1e1e",
  color: "#fff",
  borderRadius: 3,
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
  const [field, setField] = useState("");
  const [fields, setFields] = useState([]);
  const [user, setUser] = useState();
  const [status, setStatus] = useState();
  const [date, setDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndtime] = useState();
  const [players, setPlayers] = useState(0);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if (selectedInfo) {
      setField(selectedInfo.field || "");
      setDate(selectedInfo.date ? dayjs(selectedInfo.date) : null);
      setStarttime(selectedInfo.starttime ? dayjs("2023-01-01T" + selectedInfo.starttime) : null);
      setEndtime(selectedInfo.endtime ? dayjs("2023-01-01T" + selectedInfo.endtime) : null);
    }
  }, [selectedInfo]);

  const handleClose = () => {
    resetData();
    handleSubmit(false);
  };

  const resetData = () => {
    setUser();
    setEndtime();
    setStarttime();
    setStatus();
    setDate();
    setPlayers(0);
    setTeamName("");
    setField("");
  };

  const handleFilter = (Field) => {
    setField(Field);
  };

  const getField = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/fields/");
      setFields(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getField();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userrequest = await axios.get("http://localhost:8000/auth/login/success", {
        withCredentials: true,
      });
      const userId = userrequest.data.user._id;

      const body = {
        user: userId,
        field,
        status: "Pending",
        date: date.toISOString().split("T")[0],
        starttime: date.toISOString().split("T")[0] + "T" + starttime.toISOString().split("T")[1],
        endtime: date.toISOString().split("T")[0] + "T" + endtime.toISOString().split("T")[1],
        teamName,
        players,
      };

      await axios.post("http://localhost:8000/booking", body);
      toast.success("✅ Réservation confirmée !");
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
          📅 Nouvelle Réservation
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FilterFields uniqueField={fields} onFilter={handleFilter} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de l'équipe"
              variant="filled"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de joueurs"
              variant="filled"
              type="number"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{ backgroundColor: "#2a2a2a", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                label="Date"
                value={date}
                onChange={(value) => setDate(value)}
                sx={{
                  width: "100%",
                  backgroundColor: "#2a2a2a",
                  borderRadius: 1,
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
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
                onChange={(value) => setStarttime(value)}
                sx={{
                  width: "100%",
                  backgroundColor: "#2a2a2a",
                  borderRadius: 1,
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
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
                onChange={(value) => setEndtime(value)}
                sx={{
                  width: "100%",
                  backgroundColor: "#2a2a2a",
                  borderRadius: 1,
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button variant="contained" onClick={handleClose} sx={{ mr: 2 }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={onSubmit} sx={{ backgroundColor: "#54B435" }}>
            Réserver
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
