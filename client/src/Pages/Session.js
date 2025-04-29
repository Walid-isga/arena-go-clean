import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import jsPDF from "jspdf";
import axios from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";
import "../styles/Session.css";

export default function Session() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem("token");

  const fetchFieldDetails = async (fieldId) => {
    try {
      const response = await axios.get(`http://localhost:8000/fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur terrain:", error);
      return null;
    }
  };

  const load = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(`http://localhost:8000/booking/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enriched = await Promise.all(
        data.map(async (booking) => {
          const field = await fetchFieldDetails(booking.field);
          return {
            id: booking._id,
            date: booking.date.split("T")[0],
            startTime: booking.starttime,
            endTime: booking.endtime,
            field: field ? field.name : "Inconnu",
            status: booking.status,
          };
        })
      );
      setRows(enriched);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleClick = (e, index) => {
    setAnchorEl(e.currentTarget);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentIndex(null);
  };

  const handleDelete = async () => {
    const bookingId = rows[currentIndex].id;
    try {
      await axios.delete(`http://localhost:8000/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = rows.filter((_, i) => i !== currentIndex);
      setRows(updated);
      handleClose();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      const booking = await axios.get(`http://localhost:8000/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const field = await axios.get(`http://localhost:8000/fields/${booking.data.field}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRes = await axios.get(`http://localhost:8000/users/${booking.data.user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doc = new jsPDF();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("ArenaGo - Confirmation Réservation", 20, 20);
      doc.setDrawColor(255, 107, 0);
      doc.line(20, 25, 190, 25);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);
      doc.text(`ID Réservation : ${bookingId}`, 20, 40);
      doc.text(`Utilisateur : ${userRes.data.username}`, 20, 50);
      doc.text(`Email : ${userRes.data.email}`, 20, 60);
      doc.text(`Terrain : ${field.data.name}`, 20, 70);
      doc.text(`Sport : ${field.data.sport}`, 20, 80);
      doc.text(`Date : ${booking.data.date.split("T")[0]}`, 20, 90);
      doc.text(`Heure : ${booking.data.starttime} - ${booking.data.endtime}`, 20, 100);
      doc.text(`Statut : Confirmée`, 20, 110);

      doc.setFontSize(10);
      doc.text("Merci d'avoir choisi ArenaGo !", 20, 130);

      doc.save("arenaGo-confirmation.pdf");
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" color="#003566" mb={4}>
        📝 Mes Réservations
      </Typography>

      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#FF6B00" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Début</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Fin</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Terrain</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Télécharger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e0f2ff" } }}>
                  <TableCell>
                    <IconButton onClick={(e) => handleClick(e, index)} sx={{ color: "#003566" }}>
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        sx: { backgroundColor: "#ffffff", color: "#003566", borderRadius: 2 },
                      }}
                    >
                      <MenuItem onClick={handleDelete}>❌ Annuler</MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.date}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.startTime}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.endTime}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.field}</TableCell>
                  <TableCell>
                    {row.status === "Confirmed" ? (
                      <Chip label="Confirmée" color="success" variant="outlined" />
                    ) : (
                      <Chip label="En attente" color="warning" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status === "Confirmed" ? (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "#FF6B00",
                          borderColor: "#FF6B00",
                          "&:hover": {
                            backgroundColor: "#FF6B00",
                            color: "#fff",
                            borderColor: "#FF6B00",
                          },
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => handleDownload(row.id)}
                      >
                        📄 Télécharger
                      </Button>
                    ) : (
                      <Typography variant="body2" color="gray">
                        En attente
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
