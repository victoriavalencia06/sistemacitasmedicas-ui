import React, { useContext } from "react";
import {
  FaCalendar,
  FaUser,
  FaUserMd,
  FaHeart,
  FaChartBar,
  FaCog,
  FaBell,
  FaClipboardList,
  FaUsersCog,
  FaStethoscope
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({
  currentScreen,
  onNavigate,
  collapsed,
  isMobileOpen,
  onCloseMobile
}) {
  const { user } = useContext(AuthContext);

  // Mapeo de roles según tu API
  const roleNames = {
    "1": "Administrador",
    "2": "Doctor",
    "3": "Paciente",
    "6": "Secretaria"
  };

  const userRole = user?.rol?.toString() || "0";
  const roleName = roleNames[userRole] || "Sin rol";

  // Definimos el menú dependiendo del rol
  const getMenuItems = () => {
    switch (userRole) {
      case "1": // Administrador
        return [
          { id: "dashboard", label: "Dashboard", icon: FaChartBar },
          { id: "citas", label: "Citas", icon: FaCalendar },
          { id: "usuarios", label: "Usuarios", icon: FaUser },
          { id: "doctors", label: "Médicos", icon: FaUserMd },
          { id: "roles", label: "Roles", icon: FaUsersCog },
          { id: "especializaciones", label: "Especializaciones", icon: FaStethoscope },
          { id: "reports", label: "Reportes", icon: FaClipboardList },
          { id: "notifications", label: "Notificaciones", icon: FaBell }
        ];
      case "2": // Doctor
        return [
          { id: "dashboard", label: "Dashboard", icon: FaChartBar },
          { id: "appointments", label: "Citas", icon: FaCalendar },
          { id: "patients", label: "Mis Pacientes", icon: FaUser },
          { id: "notifications", label: "Notificaciones", icon: FaBell }
        ];
      case "3": // Paciente
        return [
          { id: "profile", label: "Mi Perfil", icon: FaUser },
          { id: "book-appointment", label: "Agendar Cita", icon: FaCalendar },
          { id: "my-appointments", label: "Mis Citas", icon: FaHeart },
          { id: "notifications", label: "Notificaciones", icon: FaBell }
        ];
      case "6": // Secretaria
        return [
          { id: "dashboard", label: "Dashboard", icon: FaChartBar },
          { id: "appointments", label: "Citas", icon: FaCalendar },
          { id: "patients", label: "Pacientes", icon: FaUser },
          { id: "notifications", label: "Notificaciones", icon: FaBell }
        ];
      default:
        return [
          { id: "dashboard", label: "Inicio", icon: FaChartBar }
        ];
    }
  };

  const menuItems = getMenuItems();

  // Función para manejar clic en items
  const handleItemClick = (screenId) => {
    onNavigate(screenId);
    // En móvil, cerrar sidebar después de navegar
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  return (
    <>
      <div className={`
        dashboard-sidebar 
        ${collapsed ? "collapsed" : ""}
        ${isMobileOpen ? "mobile-open" : ""}
      `}>
        {/* Rol del usuario */}
        {(!collapsed || isMobileOpen) && (
          <div className="dashboard-badge">{roleName}</div>
        )}

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                title={collapsed && !isMobileOpen ? item.label : ""}
              >
                <Icon className="sidebar-icon" />
                {(!collapsed || isMobileOpen) && (
                  <span className="sidebar-label">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sección inferior */}
        <div className="sidebar-footer">
          <button
            className="sidebar-item"
            title={collapsed && !isMobileOpen ? "Configuración" : ""}
          >
            <FaCog className="sidebar-icon" />
            {(!collapsed || isMobileOpen) && (
              <span className="sidebar-label">Configuración</span>
            )}
          </button>
        </div>
      </div>

      {/* Overlay para móviles - SOLO se muestra en móvil cuando está abierto */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "mobile-open" : ""}`}
        onClick={onCloseMobile}
      />
    </>
  );
}