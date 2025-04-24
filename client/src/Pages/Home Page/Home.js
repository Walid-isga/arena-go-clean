import React, { useEffect, useState } from "react";
import ProfileInformation from "../../Components/Home Components/Profile Information/ProfileInformation";
import SlideShow from "../../Components/Home Components/Slide Show/SlideShow";
import PlayerStatistics from "../../Components/Home Components/Statistics/PlayerStatistics";
import UpcomingGames from "../../Components/Home Components/Upcoming Games/UpcomingGames";
import LatestGames from "../../Components/Home Components/Latest Games/LatestGames";
import axios from "axios";

import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
} from "@mui/material";

export default function Home() {
  const [googleInfo, setGoogleInfo] = useState({});
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/login/success", {
          withCredentials: true,
        });
        const userData = response.data.user;
        const googleData = response.data.googleinfo;

        setUser(userData);
        setGoogleInfo(googleData);
        setName(userData.username);
        setID(userData._id);
      } catch (err) {
        console.error("Erreur lors de la récupération du user :", err);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchUserMatches = async () => {
      if (!id) return;
      try {
        const { data } = await axios.get(`http://localhost:8000/booking/user-matches/${id}`);
        setUpcomingMatches(data.upcoming);
        setPastMatches(data.past);
      } catch (error) {
        console.error("Erreur récupération des matchs :", error);
      }
    };

    fetchUserMatches();
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bienvenue {name.toUpperCase()}
              </Typography>
              <ProfileInformation userInfo1={googleInfo} userInfo2={user} />
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
