import React, { useState, useContext } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaStethoscope,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ onLogout, collapsed, onToggle, currentScreen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useContext(AuthContext);

  const userName = user?.nombre || "Usuario";
  const userEmail = user?.correo || "usuario@medicitas.com";
  // Mapeo de roles basado en tu API
  const getUserRoleName = (rol) => {
    const roleMap = {
      "1": "Administrador",
      "2": "Doctor",
      "3": "Paciente",
      "6": "Secretaria"
    };
    return roleMap[rol] || "Sin rol";
  };
    const userRole = getUserRoleName(user?.rol);


  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onToggle} title="Menú">
          <FaBars />
        </button>
        <div className="topbar-brand">
          <div className="brand-dot small">
            <FaStethoscope className="brand-icon" />
          </div>
          <span className="brand-name">MediCitas</span>
        </div>
        <div className="current-page-title">
          {getCurrentPageTitle(currentScreen)}
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Notificaciones">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="dropdown">
          <button
            className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2 p-2 rounded"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              border: "1px solid transparent",
              color: "var(--accent)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--accent-soft)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <FaUserCircle className="fs-5" />
            <span className="fw-semibold">{userName}</span>
          </button>

          {showUserMenu && (
            <div
              className="dropdown-menu show position-absolute end-0 mt-1 shadow border-0"
              style={{
                minWidth: "220px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="dropdown-header bg-light d-flex align-items-center gap-3 p-3 border-bottom">
                <FaUserCircle className="fs-4 text-primary" />
                <div>
                  <div className="fw-semibold text-dark">{userName}</div>
                  <div className="text-muted small">{userEmail}</div>
                  <div className="text-muted small">{userRole}</div>
                </div>
              </div>

              <button className="dropdown-item d-flex align-items-center gap-2 py-2">
                <FaUserCircle className="fs-6 text-muted" />
                <span>Mi Perfil</span>
              </button>

              <div className="dropdown-divider my-1"></div>

              <button
                className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                onClick={onLogout}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#fef2f2")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <FaSignOutAlt className="fs-6" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getCurrentPageTitle(currentScreen) {
  const titles = {
    dashboard: "Dashboard",
    appointments: "Citas",
    patients: "Pacientes",
    doctors: "Médicos",
    reports: "Reportes",
    notifications: "Notificaciones",
    profile: "Mi Perfil",
    "book-appointment": "Agendar Cita",
    "my-appointments": "Mis Citas",
  };
  return titles[currentScreen] || "Dashboard";
}
