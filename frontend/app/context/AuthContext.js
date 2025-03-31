"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        logout();
      }
    }
    setLoading(false); 
  }, []);

  const login = (newToken) => {
    try {
      localStorage.setItem("token", newToken);
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      setToken(newToken);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    if (window.location.pathname !== "/login") {
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
