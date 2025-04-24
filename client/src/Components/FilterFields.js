import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function FilterFields({ uniqueField, onFilter }) {
  const [field, setField] = useState("");

  const handleChange = (event) => {
    const selectedField = event.target.value;
    setField(selectedField);
    onFilter(selectedField);
  };

  return (
    <FormControl
      variant="filled"
      fullWidth
      sx={{
        minWidth: 300,
        maxWidth: 600,
        backgroundColor: "#2a2a2a",
        borderRadius: 1,
        "& .MuiInputBase-input": { color: "#fff" },
        "& .MuiInputLabel-root": { color: "#aaa" },
        "& .MuiSvgIcon-root": { color: "#ccc" },
      }}
    >
      <InputLabel id="filter-field-label">🏟️ Sélectionner un terrain</InputLabel>
      <Select
        labelId="filter-field-label"
        id="filter-field-select"
        value={field}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Tous</em>
        </MenuItem>
        {uniqueField.map((field) => (
          <MenuItem key={field._id} value={field._id}>
            {field.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
