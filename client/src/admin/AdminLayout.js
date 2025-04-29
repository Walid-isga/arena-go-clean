import React from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { Box, Container } from "@mui/material";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </>
  );
}
