import React from "react";
import "./GameInformation.css";
import locationGif from "../Assets/location.gif";
import dateGif from "../Assets/event.gif";
import soccerGif from "../Assets/ball.gif";
import basketballGif from "../Assets/basketball.gif";
import tennisGif from "../Assets/tennis.gif";
import rugbyGif from "../Assets/rugby.gif";

export default function GameInformation({ game }) {
  const { date, starttime, endtime, field } = game;

  // Format date
  const eventDate = new Date(date);
  const formattedDate = `${eventDate.getDate()} ${eventDate.toLocaleString("fr-FR", {
    month: "short",
  })}, ${eventDate.getFullYear()}`;

  // Format time
  const formattedTimeRange = `${formatTime(starttime)} - ${formatTime(endtime)}`;

  function formatTime(timeString) {
    const time = timeString.split("T")[1]; // HH:mm:ss.000Z
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  }

  const formattedString = `${formattedDate} | ${formattedTimeRange}`;

  // Détection de l’icône sport
  const sport = field?.sport?.toLowerCase();
  let sportIcon = dateGif;
  if (sport === "soccer") sportIcon = soccerGif;
  else if (sport === "basketball") sportIcon = basketballGif;
  else if (sport === "tennis") sportIcon = tennisGif;
  else if (sport === "rugby") sportIcon = rugbyGif;

  return (
    <>
      <div className="game-information">
        <div className="row-game">
          <div className="col1">
            <img className="game-icon" src={sportIcon} alt="sport" />
            <p className="game-data" id="sport-type">{field?.sport}</p>
          </div>
          <div className="col2">
            <img className="game-icon" src={locationGif} alt="lieu" />
            <p className="game-data">{field?.name}</p>
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
