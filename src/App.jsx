import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Roles from './pages/Roles'

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

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
        <Route path="/home" element={<Home />} />

        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/roles"
          element={isAuthenticated ? <Roles /> : <Navigate to="/login" replace />}
        />

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
