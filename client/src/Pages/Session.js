import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Menu, MenuItem,
  Typography, Container, Button, Box
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import jsPDF from "jspdf";

function Session() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [rows, setRows] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const open = Boolean(anchorEl);

  const fetchFieldDetails = async (fieldId) => {
    try {
      const response = await axios.get(`http://localhost:8000/fields/${fieldId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching field details:", error);
      return null;
    }
  };

  const load = async () => {
    try {
      const r = await axios.get(`http://localhost:8000/auth/login/success`, { withCredentials: true });
      const userId = r.data.user._id;
      const response = await axios.get(`http://localhost:8000/booking/user/${userId}`);

      const enriched = await Promise.all(response.data.map(async (booking) => {
        const field = await fetchFieldDetails(booking.field);
        return {
          id: booking._id,
          userId: booking.user,
          date: booking.date.split("T")[0],
          startTime: booking.starttime,
          endTime: booking.endtime,
          field: field ? field.name : "Inconnu",
          status: booking.status,
        };
      }));

      setRows(enriched);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentIndex(null);
  };

  const handleDelete = async () => {
    const bookingId = rows[currentIndex].id;
    try {
      await axios.delete(`http://localhost:8000/booking/${bookingId}`);
      const updated = rows.filter((_, i) => i !== currentIndex);
      setRows(updated);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    const bookingId = rows[currentIndex].id;
    try {
      await axios.patch(`http://localhost:8000/booking/${bookingId}`, { status: "Confirmed" });
      const updatedRows = rows.map((row, i) =>
        i === currentIndex ? { ...row, status: "Confirmed" } : row
      );
      setRows(updatedRows);
      handleClose();
    } catch (err) {
      console.error("Erreur confirmation :", err);
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      const booking = await axios.get(`http://localhost:8000/booking/${bookingId}`);
      const field = await axios.get(`http://localhost:8000/fields/${booking.data.field}`);
      const user = await axios.get(`http://localhost:8000/users/${booking.data.user}`);
  
      const doc = new jsPDF();
  
      // Titre
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Sportify - Confirmation de Réservation", 20, 20);
      doc.setDrawColor(0);
      doc.line(20, 25, 190, 25);
  
      // Infos
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Réservation ID : ${bookingId}`, 20, 40);
      doc.text(`Utilisateur : ${user.data.username}`, 20, 50);
      doc.text(`Email : ${user.data.email}`, 20, 60);
      doc.text(`Terrain : ${field.data.name}`, 20, 70);
      doc.text(`Sport : ${field.data.sport}`, 20, 80);
      doc.text(`Date : ${booking.data.date.split("T")[0]}`, 20, 90);
  
      // Formatage heure
      const formatTime = (time) =>
        new Date(time).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
  
      doc.text(
        `Heure : de ${formatTime(booking.data.starttime)} à ${formatTime(booking.data.endtime)}`,
        20,
        100
      );
  
      doc.text(`Statut : Confirmé`, 20, 110);
  
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Merci d’avoir utilisé Sportify !", 20, 130);
  
      doc.save("sportify-confirmation.pdf");
    } catch (err) {
      console.error("Erreur téléchargement PDF :", err);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#fff" }}>
          📋 Mes Réservations
        </Typography>

        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#1e1e1e",
            color: "#fff",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2c2c2c" }}>
                  <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                  <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Début</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Fin</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Terrain</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Statut</TableCell>
                  <TableCell sx={{ color: "#fff" }}>PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:hover": { backgroundColor: "#2a2a2a" } }}
                  >
                    <TableCell>
                      <IconButton onClick={(e) => handleClick(e, index)} sx={{ color: "#fff" }}>
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{ style: { backgroundColor: "#333", color: "#fff" } }}
                      >
                        <MenuItem onClick={handleConfirm}>✅ Confirmer</MenuItem>
                        <MenuItem onClick={handleDelete}>❌ Annuler</MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>{row.endTime}</TableCell>
                    <TableCell>{row.field}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.status === "Confirmed" ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownload(row.id)}
                          sx={{ color: "#fff", borderColor: "#4caf50" }}
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
    </>
  );
}

export default Session;
