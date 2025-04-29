import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import "./GameInformation.css";

export default function GameInformation({ game }) {
  const [fieldName, setFieldName] = useState("");
  const [sportType, setSportType] = useState("");

  const { date, starttime, endtime, field } = game;

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/fields/${field}`);
        setFieldName(res.data.name);
        setSportType(res.data.sport);
      } catch (err) {
        console.error("Erreur chargement terrain :", err);
      }
    };
    if (field) fetchField();
  }, [field]);

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="game-card">
      <div className="game-top">
        <span className="game-sport">{sportType}</span>
        <span className="game-date">{formattedDate}</span>
      </div>
      <div className="game-bottom">
        <span className="game-field">{fieldName}</span>
        <span className="game-time">{starttime} - {endtime}</span>
      </div>
    </div>
  );
}
