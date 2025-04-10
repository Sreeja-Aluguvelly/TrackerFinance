import React, { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
  });

  const login = async (userData) => {
    try {
      const response = await loginUser(userData);
      const token = response.data.access_token;
      setAuthState({ isAuthenticated: true, token });
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData) => {
    try {
      await registerUser(userData);
      alert('Registration Successful');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, token: null });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
