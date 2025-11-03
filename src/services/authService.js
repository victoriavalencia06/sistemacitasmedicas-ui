import api from "../api/axios";

export async function loginUser({ correo, password }) {
  const res = await api.post("/auth/login", { correo, password });
  const token = res.data?.token;
  if (token) localStorage.setItem("token", token);
  return token;
}

export function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}
