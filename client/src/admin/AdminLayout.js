import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Container } from "@mui/material";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
}
