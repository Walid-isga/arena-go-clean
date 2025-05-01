import "./App.css";
import "./custom.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages publiques
import Landing from "./Pages/LandingPage";
import Apropos from "./Pages/Apropos";
import Contact from "./Pages/Contact";

// Auth
import Login from "./Pages/Login";
import RegisterWithEmail from "./Pages/RegisterWithEmail";

// Pages utilisateur connecté
import Home from "./Pages/Home Page/Home";
import Booking from "./Pages/Booking";
import Fields from "./Pages/fields";
import FieldDetails from "./Pages/FieldDetails";
import MonProfil from "./Pages/MonProfil";
import Session from "./Pages/Session";

// Pages Admin
import AdminDashboard from "./admin/AdminDashboard";
import ReservationsTable from "./admin/ReservationsTable";
import Charts from "./admin/Charts";
import AddField from "./Pages/AddField";
import EditField from "./Pages/EditField";
import PrivateRoute from "./admin/PrivateRoute";

// Composants
import NavBar from "./Components/NavBar";
import ChatBot from "./Components/ChatBot";

import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Afficher la navbar utilisateur uniquement si :
  // - on est hors d’une route admin
  // - l'utilisateur n'est pas admin
  const isAdminPath = location.pathname.startsWith("/admin");
  const showClientNavbar = !isAdminPath && user && !user.isAdmin;

  if (loading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>
        Chargement...
      </div>
    );
  }

  return (
    <>
      {showClientNavbar && <NavBar />}

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <RegisterWithEmail /> : <Navigate to="/home" />} />

        {/* Pages utilisateur connecté */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/fields" element={user ? <Fields /> : <Navigate to="/login" />} />
        <Route path="/field/:id" element={user ? <FieldDetails /> : <Navigate to="/login" />} />
        <Route path="/monprofil" element={user ? <MonProfil /> : <Navigate to="/login" />} />
        <Route path="/session" element={user ? <Session /> : <Navigate to="/login" />} />

        {/* Pages Admin (protégées) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/reservations" element={<PrivateRoute><ReservationsTable /></PrivateRoute>} />
        <Route path="/admin/stats" element={<PrivateRoute><Charts /></PrivateRoute>} />
        <Route path="/admin/add-field" element={<PrivateRoute><AddField /></PrivateRoute>} />
        <Route path="/admin/edit-field/:id" element={<PrivateRoute><EditField /></PrivateRoute>} />

        {/* Fallback : redirection vers landing */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Ne pas afficher le ChatBot pour les admins */}
      {showClientNavbar && <ChatBot />}
    </>
  );
}

export default App;
