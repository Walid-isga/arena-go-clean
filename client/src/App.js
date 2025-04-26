import "./App.css";
import "./custom.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // ✅ useLocation ici
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Booking from "./Pages/Booking";
import Login from "./Pages/Login";
import Session from "./Pages/Session";
import Fields from "./Pages/fields";
import Home from "./Pages/Home Page/Home";
import MonProfil from "./Pages/MonProfil";
import RegisterWithEmail from "./Pages/RegisterWithEmail";
import EditField from "./Pages/EditField";
import AddField from "./Pages/AddField";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import ReservationsTable from "./admin/ReservationsTable";
import Charts from "./admin/Charts";
import PrivateRoute from "./admin/PrivateRoute";
import FieldDetails from "./Pages/FieldDetails";

// Components
import NavBar from "./Components/NavBar";
import ChatBot from "./Components/ChatBot";

// Auth context
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation(); // ✅

  // Pendant le chargement
  if (loading)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>
        Chargement...
      </div>
    );

  console.log("user =", user);
  console.log("loading =", loading);

  // ✅ Liste des routes où afficher la NavBar client
  const clientRoutes = ["/home", "/booking", "/session", "/profile", "/fields", "/field/:id"];

  // ✅ Est-ce qu'on doit afficher NavBar client ?
  const showClientNavbar = user && !user.isAdmin && clientRoutes.includes(location.pathname.toLowerCase());

  return (
    <div className="container">
      {/* ✅ Affiche seulement si client et sur la bonne page */}
      {showClientNavbar && <NavBar />}

      <Routes>
        {/* Redirection selon l’état de connexion */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterWithEmail />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/field/:id" element={<FieldDetails />} />
        <Route path="/admin/edit-field/:id" element={<EditField />} />

        {/* Pages accessibles si connecté */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/session" element={user ? <Session /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <MonProfil /> : <Navigate to="/login" />} />

        {/* Admin uniquement */}
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
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
      {/* ✅ Affiche ChatBot que pour clients */}
      {showClientNavbar && <ChatBot />}
    </div>
  );
}

export default App;
