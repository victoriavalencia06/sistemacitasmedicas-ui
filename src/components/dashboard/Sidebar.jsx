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
  FaSpinner,
  FaFileMedical,
  FaUserFriends,
  FaUserCircle,
  FaCalendarPlus,
  FaHistory,
  FaUserInjured
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

// ICONOS CORREGIDOS - Versión mejorada
const menuIcons = {
  'Dashboard': FaChartBar,
  'Citas': FaCalendar,
  'Pacientes': FaUserInjured,
  'Doctor': FaUserMd,
  'Reportes': FaClipboardList,
  'Notificaciones': FaBell,
  'Mi Perfil': FaUserCircle,
  'Agendar Cita': FaCalendarPlus,
  'Mis Citas': FaHistory,
  'Inicio': FaChartBar,
  'Roles': FaUsersCog,
  'Especializaciones': FaStethoscope,
  'Usuarios': FaUserFriends,
  'Configuración': FaCog,
  'Historial Medico': FaFileMedical
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
    console.log('🔍 DEBUG - userPermissions:', userPermissions);
    console.log('🔍 DEBUG - user rol:', user?.rol);

    if (userPermissions && userPermissions.length > 0) {
      console.log('✅ Usando permisos del contexto:', userPermissions);

      const mappedMenus = userPermissions
        .filter(menu => menu.habilitado)
        .map(menu => {
          const IconComponent = menuIcons[menu.nombreMenu] || FaCog;
          console.log(`🔍 Mapeando: "${menu.nombreMenu}" -> Icono:`, IconComponent);

          const id = menu.nombreMenu.toLowerCase().replace(/\s+/g, '-');

          return {
            id: id,
            label: menu.nombreMenu,
            icon: IconComponent,
            originalId: menu.menuId
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('✅ Menús mapeados desde contexto:', mappedMenus);
      setMenuItems(mappedMenus);
    } else {
      console.log('⚠️ No hay permisos en el contexto, usando menú por defecto');
      const defaultMenu = getDefaultMenu(user?.rol);
      console.log('✅ Menú por defecto:', defaultMenu);
      setMenuItems(defaultMenu);
    }
  }, [userPermissions, user?.rol]);

  const getDefaultMenu = (userRole) => {
    console.log('🔍 getDefaultMenu llamado con rol:', userRole);

    const roleMenus = {
      "1": [ // Administrador
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "usuarios", label: "Usuarios", icon: FaUserFriends },
        { id: "roles", label: "Roles", icon: FaUsersCog },
        { id: "pacientes", label: "Pacientes", icon: FaUserInjured },
        { id: "medicos", label: "Médicos", icon: FaUserMd },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "especializaciones", label: "Especializaciones", icon: FaStethoscope },
        { id: "historial-medico", label: "Historial Médico", icon: FaFileMedical },
        { id: "reportes", label: "Reportes", icon: FaClipboardList },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "2": [ // Doctor
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Mis Pacientes", icon: FaUserInjured },
        { id: "historial-medico", label: "Historial Médico", icon: FaFileMedical },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "3": [ // Paciente
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "agendar-cita", label: "Agendar Cita", icon: FaCalendarPlus },
        { id: "mis-citas", label: "Mis Citas", icon: FaHistory },
        { id: "historial-medico", label: "Mi Historial", icon: FaFileMedical },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell },
        { id: "perfil", label: "Mi Perfil", icon: FaUserCircle }
      ],
      "6": [ // Secretaria
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Pacientes", icon: FaUserInjured },
        { id: "medicos", label: "Médicos", icon: FaUserMd },
        { id: "historial-medico", label: "Historial Médico", icon: FaFileMedical },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ]
    };

    const menu = roleMenus[userRole] || [{ id: "dashboard", label: "Dashboard", icon: FaChartBar }];
    console.log('🔍 Menú seleccionado:', menu);
    return menu;
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

  // DEBUG: Mostrar qué iconos se están renderizando
  console.log('🎯 MenuItems actual:', menuItems);

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
            console.log(`🎯 Renderizando: ${item.label} con icono:`, Icon);

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