import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import rolService from "../services/rolService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) return null;

      const nombre = payload.nombre || payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
      const correo = payload.correo || payload.email || payload["sub"] || null;
      const rol = payload.rol || payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
      const sub = payload.sub || payload.userId || payload.id || null;

      return { nombre, correo, rol, sub, raw: payload };
    } catch {
      return null;
    }
  };

  const loadUserPermissions = async (rolId) => {
    try {
      console.log('Cargando permisos para rol:', rolId);
      const permissions = await rolService.getMenusByRol(rolId);
      console.log('Permisos cargados:', permissions);
      setUserPermissions(permissions);
      return permissions;
    } catch (error) {
      console.error('Error cargando permisos:', error);
      setUserPermissions([]);
      return [];
    }
  };

  const refreshPermissions = async () => {
    if (user?.rol) {
      console.log('Actualizando permisos en tiempo real...');
      await loadUserPermissions(user.rol);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
          await loadUserPermissions(userData.rol);
        } else {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async ({ correo, password }) => {
    const res = await api.post("/auth/login", { correo, password });

    if (!res.data?.token) throw new Error("Credenciales inválidas");

    const token = res.data.token;
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setUser(decoded);
    
    await loadUserPermissions(decoded.rol);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserPermissions([]);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userPermissions,
      isAuthenticated, 
      loading, 
      login, 
      logout,
      refreshPermissions,
      loadUserPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
}