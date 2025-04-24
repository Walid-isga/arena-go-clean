import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function Filter({ uniqueSport, onFilter }) {
  const [sport, setSport] = useState("");

  const handleChange = (event) => {
    const selectedSport = event.target.value;
    setSport(selectedSport);
    onFilter(selectedSport);
  };

  return (
    <FormControl
      variant="filled"
      sx={{
        minWidth: 250,
        backgroundColor: "#2a2a2a",
        borderRadius: 1,
        "& .MuiInputBase-input": { color: "#fff" },
        "& .MuiInputLabel-root": { color: "#aaa" },
        "& .MuiSvgIcon-root": { color: "#ccc" },
      }}
    >
      <InputLabel id="filter-sport-label">🏅 Filtrer par sport</InputLabel>
      <Select
        labelId="filter-sport-label"
        id="filter-sport-select"
        value={sport}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Tous</em>
        </MenuItem>
        {uniqueSport.map((sport, index) => (
          <MenuItem key={index} value={sport}>
            {sport}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
