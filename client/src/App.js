import "./App.css";
import "./custom.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Booking from "./Pages/Booking";
import Login from "./Pages/Login/Login";
import Session from "./Pages/Session";
import Fields from "./Pages/fields";
import Home from "./Pages/Home Page/Home";
import Signup from "./Pages/Signup/Signup";
import MonProfil from "./Pages/MonProfil";

import NavBar from "./Components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminDashboard from "./admin/AdminDashboard";
import PrivateRoute from "./admin/PrivateRoute";
import ReservationsTable from "./admin/ReservationsTable";
import Charts from "./admin/Charts";

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `http://localhost:8000/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });

      const isAdmin = data.user?.email === "rzlt404@gmail.com";
      setUser({
        ...data.user,
        isAdmin,
      });
    } catch (err) {
      console.log("Erreur de login :", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container">
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/fields" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/fields" element={user ? <Fields /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/session" element={user ? <Session /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <MonProfil /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user}>
              <AdminDashboard />
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
    </div>
  );
}

export default App;
