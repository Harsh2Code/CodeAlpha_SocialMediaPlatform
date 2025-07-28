import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load token and user from localStorage on mount
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure all expected user fields are present, provide defaults if missing
        const completeUser = {
          id: parsedUser.id || null,
          username: parsedUser.username || '',
          first_name: parsedUser.first_name || '',
          last_name: parsedUser.last_name || '',
          nationality: parsedUser.nationality || '',
          profile_picture_url: parsedUser.profile_picture_url || '',
          email: parsedUser.email || '',
          ...parsedUser,
        };
        setUser(completeUser);
      } catch (e) {
        console.error("Failed to parse authUser from localStorage", e);
        setUser(null);
      }
      setToken(savedToken);
    }
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
