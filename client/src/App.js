import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const showClientNavbar = !location.pathname.includes("/admin");

  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>Chargement...</div>;
  }

  return (
    <>
      {showClientNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <RegisterWithEmail /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/fields" element={user ? <Fields /> : <Navigate to="/login" />} />
        <Route path="/field/:id" element={user ? <FieldDetails /> : <Navigate to="/login" />} />
        <Route path="/add-field" element={user ? <AddField /> : <Navigate to="/login" />} />
        <Route path="/edit-field/:id" element={user ? <EditField /> : <Navigate to="/login" />} />
        <Route path="/monprofil" element={user ? <MonProfil /> : <Navigate to="/login" />} />
        <Route path="/session" element={<Session />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/reservations" element={<PrivateRoute><ReservationsTable /></PrivateRoute>} />
        <Route path="/admin/stats" element={<PrivateRoute><Charts /></PrivateRoute>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
      {showClientNavbar && <ChatBot />}
    </>
  );
}

export default App;
