
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import futurGif from "../Assets/past.gif";
import sleepGif from "../Assets/sleep.gif";
import GameInformation from "../Game Information/GameInformation";

export default function UpcomingGames({ matches }) {
  const filteredData = matches.filter(game => {
    if (!game.date || !game.starttime) return false;
    const dateStr = new Date(game.date).toISOString().split("T")[0];
    const fullStartDate = new Date(`${dateStr}T${game.starttime}`);
    return game.status === "Confirmed" && fullStartDate >= new Date();
  });
  
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
