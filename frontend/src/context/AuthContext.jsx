import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Base Axios instance
const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Make sure your backend is running on this
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('crmUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('crmUser');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('crmUser', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crmUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
