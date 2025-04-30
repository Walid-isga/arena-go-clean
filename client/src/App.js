import "./App.css";
import "./custom.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Booking from "./Pages/Booking";
import Landing from "./Pages/LandingPage";
import Apropos from "./Pages/Apropos";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Session from "./Pages/Session";
import Fields from "./Pages/fields";
import Home from "./Pages/Home Page/Home";
import MonProfil from "./Pages/MonProfil";
import RegisterWithEmail from "./Pages/RegisterWithEmail";
import EditField from "./Pages/EditField";
import AddField from "./Pages/AddField";
import FieldDetails from "./Pages/FieldDetails";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import ReservationsTable from "./admin/ReservationsTable";
import Charts from "./admin/Charts";
import PrivateRoute from "./admin/PrivateRoute";

// Components
import NavBar from "./Components/NavBar";
import ChatBot from "./Components/ChatBot";

import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const showClientNavbar = !location.pathname.includes("/admin");

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

        {/* Routes Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/reservations" element={<PrivateRoute><ReservationsTable /></PrivateRoute>} />
        <Route path="/admin/stats" element={<PrivateRoute><Charts /></PrivateRoute>} />
        <Route path="/admin/add-field" element={<PrivateRoute><AddField /></PrivateRoute>} />
        <Route path="/admin/edit-field/:id" element={<PrivateRoute><EditField /></PrivateRoute>} />

        {/* Redirection fallback */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
      {showClientNavbar && <ChatBot />}
    </>
  );
}

export default App;
