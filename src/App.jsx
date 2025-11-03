// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register';
import Home from './pages/Home';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Ruta home - ESTA ES LA QUE FALTA */}
        <Route
          path="/home"
          element={<Home />}
        />

        {/* Ruta pública - Login */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Ruta pública - Registro */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Ruta protegida - Dashboard */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* Ruta por defecto */}
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
