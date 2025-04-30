import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      console.log("🔍 axios baseURL:", axios.defaults.baseURL);
      console.log("📦 token dans localStorage:", token);

      if (!token) {
        console.warn("⛔ Aucun token trouvé, utilisateur non authentifié");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Utilisateur connecté :", res.data);

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("❌ Erreur /users/me :", err.response?.data || err.message);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.get("/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("❌ logout error:", err.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
