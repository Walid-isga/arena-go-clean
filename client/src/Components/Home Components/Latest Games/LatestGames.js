import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import sleepGif from "../Assets/sleep.gif";
import GameInformation from "../Game Information/GameInformation";
import "./LatestGames.css";

export default function LatestGames({ matches }) {
  const filteredData = matches.filter(game => {
    if (!game.date || !game.endtime) return false;
    const dateStr = new Date(game.date).toISOString().split("T")[0];
    const fullEndDate = new Date(`${dateStr}T${game.endtime}`);
    return game.status === "Confirmed" && fullEndDate < new Date();
  });

  return (
    <Card className="games-card">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <span className="games-icon">🏁</span>
          <Typography variant="h6" className="games-title">Derniers matchs</Typography>
        </Box>
        {filteredData.length > 0 ? (
          filteredData.map((game, i) => (
            <GameInformation key={i} game={game} />
          ))
        ) : (
          <Box textAlign="center" mt={4}>
            <img src={sleepGif} alt="Aucun match" width={100} />
            <Typography variant="body2" className="games-empty-text">Aucun match terminé</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
