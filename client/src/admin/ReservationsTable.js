import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Box,
} from "@mui/material";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

export default function ReservationsTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("/booking", {
        withCredentials: true,
      });
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de récupération des réservations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        newStatus === "Confirmed"
          ? `/booking/confirm/${id}`
          : `/booking/reject/${id}`;

      await axios.patch(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`Réservation ${newStatus.toLowerCase()} !`);
      fetchReservations();
    } catch (err) {
      console.error("Erreur mise à jour :", err.response?.data || err.message);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "Confirmed") {
      return <Chip label="Confirmée" color="success" variant="outlined" sx={{ fontWeight: "bold" }} />;
    }
    if (status === "Rejected") {
      return <Chip label="Rejetée" color="error" variant="outlined" sx={{ fontWeight: "bold" }} />;
    }
    return <Chip label="En attente" color="warning" variant="outlined" sx={{ fontWeight: "bold" }} />;
  };

  const formatTime = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    return `${h}h${m}`;
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#003566" }}>
          📋 Liste des Réservations
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, backgroundColor: "#ffffff" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#003566" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Équipe</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Début</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Fin</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Joueurs</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((row, index) => (
                <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#003566" }}>{row.teamName}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.date?.split("T")[0]}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{formatTime(row.starttime)}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{formatTime(row.endtime)}</TableCell>
                  <TableCell sx={{ color: "#003566" }}>{row.players}</TableCell>
                  <TableCell>{renderStatusBadge(row.status)}</TableCell>
                  <TableCell>
                    {row.status === "Pending" && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#45A049" },
                            fontWeight: "bold",
                          }}
                          onClick={() => handleStatusUpdate(row._id, "Confirmed")}
                        >
                          Confirmer
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#f44336",
                            color: "#f44336",
                            "&:hover": { backgroundColor: "#ffe6e6" },
                            fontWeight: "bold",
                          }}
                          onClick={() => handleStatusUpdate(row._id, "Rejected")}
                        >
                          Rejeter
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AdminLayout>
  );
}
