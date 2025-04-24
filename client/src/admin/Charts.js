import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AdminLayout from "./AdminLayout";
import axios from "axios";

const COLORS = ["#4FC3F7", "#81C784", "#FFD54F", "#FF8A65", "#9575CD", "#F06292"];

export default function Charts() {
  const [stats, setStats] = useState({ byDate: [], byField: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/stats", {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress color="info" />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  if (!stats.byDate.length && !stats.byField.length) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="warning.main">
            Il n'y a encore aucune réservation enregistrée.
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 3, color: "#fff" }}
      >
        📊 Statistiques des Réservations
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 2 }}>
        {/* Bar Chart - Réservations par jour */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            flex: 1,
            minWidth: "300px",
          }}
          elevation={4}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            📅 Réservations par jour
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="_id" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="count" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Pie Chart - Réservations par terrain */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            minWidth: "300px",
          }}
          elevation={4}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            🏟️ Réservations par terrain
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byField}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.byField.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
