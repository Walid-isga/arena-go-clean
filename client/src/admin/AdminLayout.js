import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#fff" }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          mt: 2,
          backgroundColor: "#1e1e1e",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          boxShadow: "-5px 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
