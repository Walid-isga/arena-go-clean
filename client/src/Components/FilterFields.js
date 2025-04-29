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
      variant="outlined"
      fullWidth
      sx={{
        minWidth: 300,
        maxWidth: 600,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        "& .MuiInputBase-root": {
          color: "#003566 !important",
          fontWeight: "bold",
          borderRadius: "12px !important",
        },
        "& .MuiInputLabel-root": {
          color: "#003566 !important",
          fontWeight: "bold",
        },
        "& fieldset": {
          borderColor: "#003566 !important",
        },
        "&:hover fieldset": {
          borderColor: "#FF6B00 !important",
        },
        "& .MuiSvgIcon-root": {
          color: "#003566 !important",
        },
      }}
    >
      <InputLabel id="filter-field-label">🏟️ Sélectionner un terrain</InputLabel>
      <Select
        labelId="filter-field-label"
        id="filter-field-select"
        value={field}
        onChange={handleChange}
        label="🏟️ Sélectionner un terrain"
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
