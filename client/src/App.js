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

// Auth context
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>
        Chargement...
      </div>
    );
  }

  console.log("user =", user);
  console.log("loading =", loading);

  // Liste des routes pour le client normal
  const clientRoutes = ["/home", "/booking", "/session", "/profile", "/fields", "/field/:id"];
  const showClientNavbar = user && !user.isAdmin && clientRoutes.includes(location.pathname.toLowerCase());

  // Vérifier si on est sur la Landing ou pages publiques
  const isPublicPage = ["/landing", "/apropos", "/contact"].includes(location.pathname.toLowerCase());

  return (
    <>
      {/* Navbar uniquement pour Client connecté */}
      {showClientNavbar && <NavBar />}

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentification */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterWithEmail />} />

        {/* Pages Client connecté */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/session" element={user ? <Session /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <MonProfil /> : <Navigate to="/login" />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/field/:id" element={<FieldDetails />} />

        {/* Admin sécurisé */}
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-field"
          element={
            <PrivateRoute user={user}>
              <AddField />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit-field/:id"
          element={
            <PrivateRoute user={user}>
              <EditField />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <PrivateRoute user={user}>
              <ReservationsTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <PrivateRoute user={user}>
              <Charts />
            </PrivateRoute>
          }
        />

        {/* Rediriger tout autre URL vers Landing */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ChatBot seulement si client connecté */}
      {showClientNavbar && <ChatBot />}
    </>
  );
}

export default App;
