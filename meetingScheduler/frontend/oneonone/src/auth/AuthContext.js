import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const checkAuthStatus = async () => {
    // No immediate state update before the async operation
    try {
      const response = await fetch(`${API_URL}users/me/`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        throw new Error("Session expired or user not authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
    } finally {
      setLoading(false); // Ensure loading is false after the check
    }
  };

  useEffect(() => {
    const isAuthenticatedInStorage = localStorage.getItem("isAuthenticated");
    if (isAuthenticatedInStorage) {
      checkAuthStatus(); // Verify against the server
    } else {
      setLoading(false); // If not authenticated, no need to verify, just set loading to false
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        const data = await response.json();
        throw new Error(data.non_field_errors?.join(" ") || "Login failed.");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}users/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      } else {
        alert("Logout failed!");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Render children or loading indicator based on the loading state
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
