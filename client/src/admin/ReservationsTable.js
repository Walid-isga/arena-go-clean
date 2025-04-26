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
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

export default function ReservationsTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/booking", {
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
          ? `http://localhost:8000/booking/confirm/${id}`
          : `http://localhost:8000/booking/reject/${id}`;

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

  // Format heures : "10:30" → "10h30"
  const formatTime = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    return `${h}h${m}`;
  };

  return (
    <AdminLayout>
      <Typography variant="h5" gutterBottom>
        Réservations
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nom de l'équipe</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Heure début</TableCell>
                <TableCell>Heure fin</TableCell>
                <TableCell>Joueurs</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.teamName}</TableCell>
                  <TableCell>{row.date?.split("T")[0]}</TableCell>
                  <TableCell>{formatTime(row.starttime)}</TableCell>
                  <TableCell>{formatTime(row.endtime)}</TableCell>
                  <TableCell>{row.players}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.status === "Pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusUpdate(row._id, "Confirmed")}
                        >
                          Confirmer
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleStatusUpdate(row._id, "Rejected")}
                        >
                          Rejeter
                        </Button>
                      </>
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
