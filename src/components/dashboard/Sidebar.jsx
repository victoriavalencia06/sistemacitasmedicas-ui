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
  FaUsersCog // Nuevo icono para Roles
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ currentScreen, onNavigate, collapsed }) {
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
          { id: "appointments", label: "Citas", icon: FaCalendar },
          { id: "patients", label: "Pacientes", icon: FaUser },
          { id: "doctors", label: "Médicos", icon: FaUserMd },
          { id: "roles", label: "Roles", icon: FaUsersCog }, // Nuevo item
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

  return (
    <>
      <div className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Rol del usuario */}
        {!collapsed && <div className="role-badge">{roleName}</div>}

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                title={collapsed ? item.label : ""}
              >
                <Icon className="sidebar-icon" />
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sección inferior */}
        <div className="sidebar-footer">
          <button className="sidebar-item" title={collapsed ? "Configuración" : ""}>
            <FaCog className="sidebar-icon" />
            {!collapsed && <span className="sidebar-label">Configuración</span>}
          </button>
        </div>
      </div>

      {/* Overlay para móviles */}
      {!collapsed && <div className="sidebar-overlay" />}
    </>
  );
}