import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Decodifica el JWT para obtener el nombre y datos del usuario
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeToken(token);
      setUser(data);
    }
  }, []);

const login = async ({ correo, password, passwordHash, nombre }) => {
  const res = await fetch("http://Citas.somee.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password, passwordHash, nombre }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const data = await res.json();
  localStorage.setItem("token", data.token);

  const decoded = decodeToken(data.token);
  setUser(decoded);
};


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
