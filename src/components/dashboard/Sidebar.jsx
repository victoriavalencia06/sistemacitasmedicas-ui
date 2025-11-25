import React, { useContext, useState, useEffect } from "react";
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
  FaStethoscope,
  FaSpinner
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const menuIcons = {
  'Dashboard': FaChartBar,
  'Citas': FaCalendar,
  'Pacientes': FaUser,
  'Médicos': FaUserMd,
  'Reportes': FaClipboardList,
  'Notificaciones': FaBell,
  'Mi Perfil': FaUser,
  'Agendar Cita': FaCalendar,
  'Mis Citas': FaHeart,
  'Inicio': FaChartBar,
  'Roles': FaUsersCog,
  'Especializaciones': FaStethoscope,
  'Usuarios': FaUsersCog,
  'Configuración': FaCog
};

export default function Sidebar({
  currentScreen,
  onNavigate,
  collapsed,
  isMobileOpen,
  onCloseMobile
}) {
  const { user, userPermissions } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userPermissions && userPermissions.length > 0) {
      console.log('Usando permisos del contexto:', userPermissions);
      
      const mappedMenus = userPermissions
        .filter(menu => menu.habilitado)
        .map(menu => {
          const IconComponent = menuIcons[menu.nombreMenu] || FaCog;
          const id = menu.nombreMenu.toLowerCase().replace(/\s+/g, '-');
          
          return {
            id: id,
            label: menu.nombreMenu,
            icon: IconComponent,
            originalId: menu.menuId
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Menús mapeados desde contexto:', mappedMenus);
      setMenuItems(mappedMenus);
    } else {
      console.log('No hay permisos en el contexto, usando menú por defecto');
      setMenuItems(getDefaultMenu(user?.rol));
    }
  }, [userPermissions, user?.rol]);

  const getDefaultMenu = (userRole) => {
    const roleMenus = {
      "1": [
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Pacientes", icon: FaUser },
        { id: "medicos", label: "Médicos", icon: FaUserMd },
        { id: "reportes", label: "Reportes", icon: FaClipboardList },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell },
        { id: "roles", label: "Roles", icon: FaUsersCog },
        { id: "especializaciones", label: "Especializaciones", icon: FaStethoscope },
        { id: "usuarios", label: "Usuarios", icon: FaUsersCog }
      ],
      "2": [
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Mis Pacientes", icon: FaUser },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "3": [
        { id: "perfil", label: "Mi Perfil", icon: FaUser },
        { id: "agendar-cita", label: "Agendar Cita", icon: FaCalendar },
        { id: "mis-citas", label: "Mis Citas", icon: FaHeart },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "6": [
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Pacientes", icon: FaUser },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ]
    };

    return roleMenus[userRole] || [{ id: "dashboard", label: "Dashboard", icon: FaChartBar }];
  };

  const roleNames = {
    "1": "Administrador",
    "2": "Doctor", 
    "3": "Paciente",
    "6": "Secretaria"
  };

  const userRole = user?.rol?.toString() || "0";
  const roleName = roleNames[userRole] || "Sin rol";

  const handleItemClick = (screenId) => {
    console.log('Sidebar - Clic en:', screenId);
    onNavigate(screenId);
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  if (loading) {
    return (
      <div className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-loading">
          <FaSpinner className="spinner" />
          <span>Cargando menú...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`
        dashboard-sidebar 
        ${collapsed ? "collapsed" : ""}
        ${isMobileOpen ? "mobile-open" : ""}
      `}>
        {(!collapsed || isMobileOpen) && (
          <div className="dashboard-badge">{roleName}</div>
        )}

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

        <div className="sidebar-footer">
          <button
            className="sidebar-item"
            title={collapsed && !isMobileOpen ? "Configuración" : ""}
            onClick={() => handleItemClick('configuracion')}
          >
            <FaCog className="sidebar-icon" />
            {(!collapsed || isMobileOpen) && (
              <span className="sidebar-label">Configuración</span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`sidebar-overlay ${isMobileOpen ? "mobile-open" : ""}`}
        onClick={onCloseMobile}
      />
    </>
  );
}