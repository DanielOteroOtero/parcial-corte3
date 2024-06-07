import React, { createContext, useContext, useState } from 'react';
import authService from './authService';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('')

  const register = async (email, password, onRegisterSuccess) => {
    try {
      const response = await axios.post('http://localhost:3000/register', {
        email,
        password
      });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        setIsLoggedIn(true);
        onRegisterSuccess();
      }
    } catch (error) {
      setError('Error al registrar: ' + error.message)
      console.error('Error al registrar:', error);
    }
  };

  const login = async (email, password, onLoginSuccess) => {
    try {
      const response = await authService.login(email, password);
      if (response && response.token) {
        localStorage.setItem('user', JSON.stringify(response));
        setCurrentUser(response)
        setIsLoggedIn(true)
        onLoginSuccess()
      } else {
        console.error('La respuesta no contiene un token');
      }
    } catch (error) {
      setError('Error al iniciar sesion: ')
      console.error('Error al iniciar sesión:', error);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, register, login, logout }}>
      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {children}
    </AuthContext.Provider>
  );
};