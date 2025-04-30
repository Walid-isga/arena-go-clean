import React, { useEffect, useState } from "react";
import ProfileInformation from "../../Components/Home Components/Profile Information/ProfileInformation";
import SlideShow from "../../Components/Home Components/Slide Show/SlideShow";
import PlayerStatistics from "../../Components/Home Components/Statistics/PlayerStatistics";
import UpcomingGames from "../../Components/Home Components/Upcoming Games/UpcomingGames";
import LatestGames from "../../Components/Home Components/Latest Games/LatestGames";

import { Container, Grid, Typography, Paper, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "../../axiosConfig";

import "../../styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Utilisateur reçu dans Home :", res.data);
        setUser(res.data);
        fetchUserMatches(res.data._id);
      } catch (error) {
        console.error("❌ Erreur utilisateur :", error.response?.data || error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  const fetchUserMatches = async (userId) => {
    try {
      const res = await axios.get(`/booking/user-matches/${userId}`);
      setUpcomingMatches(res.data.upcoming);
      setPastMatches(res.data.past);
    } catch (error) {
      console.error("❌ Erreur récupération des matchs :", error.response?.data || error.message);
    } finally {
      setLoading(false);
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
