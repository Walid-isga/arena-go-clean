// src/Pages/Home.jsx

import React, { useEffect, useState } from "react";
import ProfileInformation from "../../Components/Home Components/Profile Information/ProfileInformation";
import SlideShow from "../../Components/Home Components/Slide Show/SlideShow";
import PlayerStatistics from "../../Components/Home Components/Statistics/PlayerStatistics";
import UpcomingGames from "../../Components/Home Components/Upcoming Games/UpcomingGames";
import LatestGames from "../../Components/Home Components/Latest Games/LatestGames";

import { Container, Grid, Typography, Paper, Card, CardContent, CircularProgress } from "@mui/material";

import "../../styles/Home.css"; // ✅ Ton futur Home.css que je vais aussi te donner

export default function Home() {
  const [user, setUser] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Non autorisé");
        const data = await res.json();

        setUser(data);
        fetchUserMatches(data._id);
      } catch (error) {
        console.error("Erreur utilisateur :", error);
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  // Charger les matchs
  const fetchUserMatches = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/booking/user-matches/${userId}`);
      const data = await res.json();
      setUpcomingMatches(data.upcoming);
      setPastMatches(data.past);
    } catch (error) {
      console.error("Erreur récupération des matchs :", error);
    } finally {
      setLoading(false); // ✅ arrêt du spinner après tout
    }
  };

  if (loading || !user) {
    return (
      <div className="home-loader">
        <CircularProgress size={60} sx={{ color: "#FF6B00 !important" }} />
        <Typography mt={2} color="#003566" fontWeight="bold">
          Chargement de votre espace...
        </Typography>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" className="home-container">
      <Grid container spacing={3} className="fade-in">
        
        <Grid item xs={12} md={4}>
          <Card className="home-card">
            <CardContent>
              <Typography variant="h6" className="home-title">
                Bienvenue {user.username?.toUpperCase() || "Utilisateur"}
              </Typography>
              <ProfileInformation user={user} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="home-card">
            <CardContent>
              <SlideShow />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={4} className="home-section">
            <Typography variant="h6" className="home-subtitle">
              Statistiques personnelles
            </Typography>
            <PlayerStatistics userInfo={user} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="home-section">
            <UpcomingGames matches={upcomingMatches} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="home-section">
            <LatestGames matches={pastMatches} />
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}
