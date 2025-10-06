// contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");
      const userData = {
        id: localStorage.getItem("userId"),
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("userEmail"),
        role: localStorage.getItem("roleName"),
        roleId: localStorage.getItem("roleId"),
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken")
      };

      if (token && userData.id) {
        setUser(userData);
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    
    // Store in localStorage
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("roleId", userData.roleId);
    localStorage.setItem("roleName", userData.role);
    
    // Set axios default headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("roleId");
    localStorage.removeItem("roleName");
    
    // Remove axios default headers
    delete axios.defaults.headers.common['Authorization'];
    
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};