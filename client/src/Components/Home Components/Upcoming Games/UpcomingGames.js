import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import futurGif from "../Assets/past.gif";
import sleepGif from "../Assets/sleep.gif";
import GameInformation from "../Game Information/GameInformation";

export default function UpcomingGames({ userID }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/booking/user/${userID}`);
        const now = new Date();

        const upcoming = data.filter(game => {
          const start = new Date(game.starttime);
          return game.status === "Confirmed" && start >= now;
        });

        setFilteredData(upcoming);
      } catch (error) {
        console.error("Erreur récupération des matchs :", error);
      }
    };

    fetchData();
  }, [userID]);

  return (
    <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <img src={futurGif} alt="icon" style={{ width: 32, marginRight: 10 }} />
          <Typography variant="h6" color="#fff">Prochains matchs</Typography>
        </Box>

        {filteredData.length > 0 ? (
          filteredData.map((game, i) => (
            <GameInformation key={i} game={game} />
          ))
        ) : (
          <Box textAlign="center">
            <img src={sleepGif} alt="En attente" width={80} />
            <Typography variant="body2" color="#bbb">
              Aucun match prévu
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
