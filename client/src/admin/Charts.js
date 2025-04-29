import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import AdminLayout from "./AdminLayout";
import axios from "../axiosConfig";

const COLORS = ["#4FC3F7", "#81C784", "#FFD54F", "#FF8A65", "#9575CD", "#F06292"];

export default function Charts() {
  const [stats, setStats] = useState({ byDate: [], byField: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats", { withCredentials: true });
        setStats(response.data);
      } catch (error) {
        console.error("Erreur récupération stats:", error);
      } finally {
        setLoading(false);
      }
    };
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

  return (
    <AdminLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#003566" }}>
        📊 Statistiques des Réservations
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Paper elevation={4} sx={{ flex: 1, p: 3, backgroundColor: "#ffffff", color: "#003566", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📅 Réservations par jour
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#003566" />
              <YAxis stroke="#003566" />
              <Tooltip />
              <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={4} sx={{ flex: 1, p: 3, backgroundColor: "#ffffff", color: "#003566", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🏟️ Réservations par terrain
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.byField} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                {stats.byField.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
