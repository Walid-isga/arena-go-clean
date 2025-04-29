import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsRugbyIcon from "@mui/icons-material/SportsRugby";
import CountUp from "react-countup";
import axios from "../../../axiosConfig";
import "./PlayerStatistics.css";

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

        const foot = confirmed.filter(b => b.field?.sport === "Football").length;
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
    <Card className="player-statistics-card">
      <CardContent>
        <Typography variant="h5" className="player-statistics-title">
          Statistiques de {userInfo?.username || "joueur"}
        </Typography>

        <Grid container spacing={3}>
          <StatItem label="Matchs de Foot" value={stats.foot} icon={<SportsSoccerIcon sx={{ color: "#FF6B00" }} />} />
          <StatItem label="Matchs de Basket" value={stats.basket} icon={<SportsBasketballIcon sx={{ color: "#FF6B00" }} />} />
          <StatItem label="Matchs de Tennis" value={stats.tennis} icon={<SportsTennisIcon sx={{ color: "#FF6B00" }} />} />
          <StatItem label="Matchs de Rugby" value={stats.rugby} icon={<SportsRugbyIcon sx={{ color: "#FF6B00" }} />} />
        </Grid>
      </CardContent>
    </Card>
  );
}

const StatItem = ({ label, value, icon }) => (
  <Grid item xs={6} md={3}>
    <Box className="stat-item fade-in">
      {icon}
      <Typography variant="h4" className="stat-value">
        <CountUp end={value} duration={2} />
      </Typography>
      <Typography variant="body2" className="stat-label">
        {label}
      </Typography>
    </Box>
  </Grid>
);
