import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axiosConfig"; // ✅ Assure-toi que cette instance utilise REACT_APP_API_URL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get("/auth/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("❌ Erreur lors du logout :", err);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
