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
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import jsPDF from "jspdf";
import axios from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";

export default function Session() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem("token");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchFieldDetails = async (fieldId) => {
    try {
      const response = await axios.get(`/fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      return null;
    }
  };

  const load = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(`/booking/user/${user._id}`, {
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
    } catch (err) {
      console.error(err);
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
      await axios.delete(`/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(rows.filter((_, i) => i !== currentIndex));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      const booking = await axios.get(`/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const field = await axios.get(`/fields/${booking.data.field}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRes = await axios.get(`/users/${booking.data.user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doc = new jsPDF();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("ArenaGo - Confirmation Réservation", 20, 20);
      doc.setDrawColor(255, 107, 0);
      doc.line(20, 25, 190, 25);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        color="#003566"
        mb={4}
        textAlign="center"
      >
        📝 Mes Réservations
      </Typography>

      {!isMobile ? (
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: "auto" }}>
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
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>{row.endTime}</TableCell>
                    <TableCell>{row.field}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status === "Confirmed" ? "Confirmée" : "En attente"}
                        color={row.status === "Confirmed" ? "success" : "warning"}
                        variant="outlined"
                      />
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
      ) : (
        // 📱 MOBILE VIEW : cards
        rows.map((row, index) => (
          <Card key={index} elevation={4} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold" color="#003566">
                  {row.date}
                </Typography>
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
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography>⏰ {row.startTime} - {row.endTime}</Typography>
              <Typography>🏟 Terrain : {row.field}</Typography>
              <Typography>
                📌 Statut :{" "}
                <Chip
                  label={row.status === "Confirmed" ? "Confirmée" : "En attente"}
                  color={row.status === "Confirmed" ? "success" : "warning"}
                  size="small"
                />
              </Typography>

              {row.status === "Confirmed" ? (
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 2,
                    color: "#FF6B00",
                    borderColor: "#FF6B00",
                    "&:hover": {
                      backgroundColor: "#FF6B00",
                      color: "#fff",
                      borderColor: "#FF6B00",
                    },
                  }}
                  onClick={() => handleDownload(row.id)}
                >
                  📄 Télécharger PDF
                </Button>
              ) : (
                <Typography mt={2} variant="body2" color="gray">
                  ⚠️ En attente de validation
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
