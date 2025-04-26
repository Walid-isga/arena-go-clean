import React, { useEffect, useState } from "react";
import "./GameInformation.css";
import locationGif from "../Assets/location.gif";
import dateGif from "../Assets/event.gif";
import soccerGif from "../Assets/ball.gif";
import basketballGif from "../Assets/basketball.gif";
import tennisGif from "../Assets/tennis.gif";
import rugbyGif from "../Assets/rugby.gif";
import axios from "axios";

export default function GameInformation({ game }) {
  const [fieldName, setFieldName] = useState("");
  const [sportIcon, setSportIcon] = useState("");
  const [sportType, setSportType] = useState("");

  const { date, starttime, endtime, field, teamName } = game;

  // ✅ Hook toujours en haut (jamais après un return)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/fields/${field}`);
        const { sport, name } = data;
        setFieldName(name);
        setSportType(sport);

        const sportLower = sport.toLowerCase();
        if (sportLower === "basketball") setSportIcon(basketballGif);
        else if (sportLower === "soccer") setSportIcon(soccerGif);
        else if (sportLower === "tennis") setSportIcon(tennisGif);
        else if (sportLower === "rugby") setSportIcon(rugbyGif);
        else setSportIcon(dateGif); // fallback si sport inconnu
      } catch (error) {
        console.error("Erreur lors de la récupération du terrain :", error);
      }
    };

    if (field) fetchData();
  }, [field]);

  // ✅ Sécurité : Si les données sont incomplètes
  if (!date || !starttime || !endtime) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        ⛔ Données de match incomplètes {teamName && `(équipe: ${teamName})`}
      </div>
    );
  }

  // Formatage de la date (ex: 25 avr., 2025)
  const eventDate = new Date(date);
  const formattedDate = `${eventDate.getDate()} ${eventDate.toLocaleString("fr-FR", {
    month: "short",
  })}, ${eventDate.getFullYear()}`;

  // ✅ Formatage propre de l'heure
  const formattedTimeRange = `${formatTime(starttime)} - ${formatTime(endtime)}`;

  function formatTime(timeString) {
    if (!timeString) return "Heure inconnue";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  }

  const formattedString = `${formattedDate} | ${formattedTimeRange}`;

  return (
    <>
      <div className="game-information">
        <div className="row-game">
          <div className="col1">
            <img className="game-icon" src={sportIcon} alt="sport" />
            <p className="game-data" id="sport-type">{sportType}</p>
          </div>
          <div className="col2">
            <img className="game-icon" src={locationGif} alt="lieu" />
            <p className="game-data">{fieldName}</p>
          </div>
          <div className="col3">
            <img className="game-icon" src={dateGif} alt="date" />
            <p className="game-data">{formattedString}</p>
          </div>
        </div>
      </div>
      <hr className="new-line-game" />
    </>
  );
}
