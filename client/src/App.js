// extrait principal corrigé
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
      {/* ... les autres routes */}
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    {showClientNavbar && <ChatBot />}
  </>
);
