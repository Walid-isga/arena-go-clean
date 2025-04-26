import React, { useEffect, useState } from "react";
import ProfileInformation from "../../Components/Home Components/Profile Information/ProfileInformation";
import SlideShow from "../../Components/Home Components/Slide Show/SlideShow";
import PlayerStatistics from "../../Components/Home Components/Statistics/PlayerStatistics";
import UpcomingGames from "../../Components/Home Components/Upcoming Games/UpcomingGames";
import LatestGames from "../../Components/Home Components/Latest Games/LatestGames";

import {
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
} from "@mui/material";

export default function Home() {
  const [user, setUser] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);

  // Charger l'utilisateur connecté depuis le backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔐 récupère le token JWT

        const res = await fetch("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Non autorisé");
        const data = await res.json();

        setUser(data);

        // 🔁 Ensuite, charger les matchs
        fetchUserMatches(data._id);
      } catch (error) {
        console.error("Erreur utilisateur :", error);
        window.location.href = "/login"; // redirige si pas connecté
      }
    };

    fetchUser();
  }, []);

  // Charger les matchs depuis l'API
  const fetchUserMatches = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/booking/user-matches/${userId}`);
      const data = await res.json();
      setUpcomingMatches(data.upcoming);
      setPastMatches(data.past);
    } catch (error) {
      console.error("Erreur récupération des matchs :", error);
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bienvenue {user.username?.toUpperCase() || "Utilisateur"}
              </Typography>
              <ProfileInformation user={user} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <SlideShow />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques personnelles
            </Typography>
            <PlayerStatistics userInfo={user} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prochains matchs
            </Typography>
            <UpcomingGames matches={upcomingMatches} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Derniers matchs
            </Typography>
            <LatestGames matches={pastMatches} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
