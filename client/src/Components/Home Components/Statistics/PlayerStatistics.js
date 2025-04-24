import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsRugbyIcon from "@mui/icons-material/SportsRugby";
import axios from "axios";

export default function PlayerStatistics({ userInfo }) {
  const [stats, setStats] = useState({
    foot: 0,
    basket: 0,
    tennis: 0,
    rugby: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/booking/user/${userInfo._id}`);
        const confirmed = res.data.filter(b => b.status === "Confirmed");

        const foot = confirmed.filter(b => b.field?.sport === "Soccer").length;
        const basket = confirmed.filter(b => b.field?.sport === "Basketball").length;
        const tennis = confirmed.filter(b => b.field?.sport === "Tennis").length;
        const rugby = confirmed.filter(b => b.field?.sport === "Rugby").length;

        setStats({ foot, basket, tennis, rugby });
      } catch (err) {
        console.error("Erreur stats joueur :", err);
      }
    };

    if (userInfo._id) {
      fetchStats();
    }
  }, [userInfo]);

  return (
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Statistiques de {userInfo?.username || "joueur"}
        </Typography>

        <Grid container spacing={3}>
          <StatItem label="Matchs de foot" value={stats.foot} icon={<SportsSoccerIcon color="primary" />} />
          <StatItem label="Matchs de basket" value={stats.basket} icon={<SportsBasketballIcon color="primary" />} />
          <StatItem label="Matchs de tennis" value={stats.tennis} icon={<SportsTennisIcon color="primary" />} />
          <StatItem label="Matchs de rugby" value={stats.rugby} icon={<SportsRugbyIcon color="primary" />} />
        </Grid>
      </CardContent>
    </Card>
  );
}

const StatItem = ({ label, value, icon }) => (
  <Grid item xs={6} md={3}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#1f1f1f",
        padding: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      {icon}
      <Typography variant="h5" mt={1}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Grid>
);
