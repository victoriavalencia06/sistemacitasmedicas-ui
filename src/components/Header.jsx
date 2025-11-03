import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const nombre =
    user?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ] || user?.name || user?.sub;

  return (
    <header className="glass">
      <nav className="navbar navbar-expand-lg container">
        <a className="navbar-brand" href="#">MediCitas</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><a className="nav-link" href="#services">Servicios</a></li>
            <li className="nav-item"><a className="nav-link" href="#about">Sobre Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contacto</a></li>
          </ul>

          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-dark">👤 {nombre}</span>
              <button className="btn btn-danger btn-sm" onClick={logout}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-import ms-2">Iniciar Sesión</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
