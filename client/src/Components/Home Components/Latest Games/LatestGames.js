
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import pastGif from "../Assets/past.gif";
import lazyIcon from "../Assets/lazy.gif";
import GameInformation from "../Game Information/GameInformation";

export default function LatestGames({ matches }) {
  const filteredData = matches.filter(game => {
    if (!game.date || !game.endtime) return false;
    const dateStr = new Date(game.date).toISOString().split("T")[0];
    const fullEndDate = new Date(`${dateStr}T${game.endtime}`);
    return game.status === "Confirmed" && fullEndDate < new Date();
  });
  

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
