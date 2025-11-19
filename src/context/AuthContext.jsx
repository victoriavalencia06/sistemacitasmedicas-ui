import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ NUEVO: para forzar actualizaciones

  // Función para decodificar y normalizar token JWT
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) return null;

      // Normalización de claves comunes
      const nombre =
        payload.nombre ||
        payload.name ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        null;

      const correo =
        payload.correo ||
        payload.email ||
        payload["sub"] ||
        null;

      const rol =
        payload.rol ||
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        null;

      const sub = payload.sub || payload.userId || payload.id || null;

      return { nombre, correo, rol, sub, raw: payload };
    } catch {
      return null;
    }
  };

  // ✅ NUEVA FUNCIÓN: Forzar actualización de permisos
  const refreshPermissions = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('🔁 Forzando actualización de permisos...');
  };

  // Al cargar, revisar si hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeToken(token);
      if (data) setUser(data);
      else localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  // ✅ NUEVO EFECTO: Se ejecuta cuando cambian los permisos
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 Actualizando contexto de autenticación...');
      // Aquí puedes agregar lógica adicional para recargar permisos del backend si es necesario
    }
  }, [refreshTrigger]);

  const login = async ({ correo, password }) => {
    const res = await api.post("/auth/login", { correo, password });

    if (!res.data?.token) throw new Error("Credenciales inválidas");

    const token = res.data.token;
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      refreshPermissions // ✅ EXPONER LA FUNCIÓN DE ACTUALIZACIÓN
    }}>
      {children}
    </AuthContext.Provider>
  );
}