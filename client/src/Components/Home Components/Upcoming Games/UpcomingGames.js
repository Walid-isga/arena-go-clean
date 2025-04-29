import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import sleepGif from "../Assets/sleep.gif";
import GameInformation from "../Game Information/GameInformation";
import "./UpcomingGames.css";

export default function UpcomingGames({ matches }) {
  const filteredData = matches.filter(game => {
    if (!game.date || !game.starttime) return false;
    const dateStr = new Date(game.date).toISOString().split("T")[0];
    const fullStartDate = new Date(`${dateStr}T${game.starttime}`);
    return game.status === "Confirmed" && fullStartDate >= new Date();
  });

  return (
    <Card className="games-card">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <span className="games-icon">🕑</span>
          <Typography variant="h6" className="games-title">Prochains matchs</Typography>
        </Box>
        {filteredData.length > 0 ? (
          filteredData.map((game, i) => (
            <GameInformation key={i} game={game} />
          ))
        ) : (
          <Box textAlign="center" mt={4}>
            <img src={sleepGif} alt="Aucun match" width={100} />
            <Typography variant="body2" className="games-empty-text">Aucun match prévu</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
