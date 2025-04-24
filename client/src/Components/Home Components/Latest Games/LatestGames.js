import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import pastGif from "../Assets/past.gif";
import lazyIcon from "../Assets/lazy.gif";
import GameInformation from "../Game Information/GameInformation";

export default function LatestGames({ userID }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/booking/user/${userID}`);

        const now = new Date();

        const pastGames = data.filter(game => {
          const endTime = new Date(game.endtime);
          return game.status === "Confirmed" && endTime < now;
        });

        setFilteredData(pastGames);
      } catch (error) {
        console.error("Erreur récupération des derniers matchs :", error);
      }
    };

    fetchData();
  }, [userID]);

  return (
    <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <img src={pastGif} alt="icon" style={{ width: 32, marginRight: 10 }} />
          <Typography variant="h6" color="#fff">Derniers matchs</Typography>
        </Box>
        {filteredData.length > 0 ? (
          filteredData.map((game, i) => (
            <GameInformation key={i} game={game} />
          ))
        ) : (
          <Box textAlign="center">
            <img src={lazyIcon} alt="Aucun match" width={80} />
            <Typography variant="body2" color="#bbb">
              Aucun match terminé
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
