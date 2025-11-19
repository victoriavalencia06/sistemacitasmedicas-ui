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
import rolService from "../../services/rolService";

// Mapeo de iconos por nombre de menú
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

// ✅ FUNCIÓN PRINCIPAL - export default directamente
export default function Sidebar({
  currentScreen,
  onNavigate,
  collapsed,
  isMobileOpen,
  onCloseMobile
}) {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar menús permitidos para el rol del usuario
  useEffect(() => {
    const loadUserMenus = async () => {
      if (!user?.rol) {
        console.log('❌ No hay rol de usuario');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📡 Cargando menús para rol:', user.rol);
        
        // Obtener los menús habilitados para el rol del usuario
        const userMenus = await rolService.getMenusByRol(user.rol);
        console.log('✅ Menús recibidos de la API:', userMenus);
        
        // Filtrar solo los menús habilitados y mapear a la estructura del sidebar
        const mappedMenus = userMenus
          .filter(menu => {
            const habilitado = menu.habilitado;
            console.log(`📊 Menú: ${menu.nombreMenu} - Habilitado: ${habilitado}`);
            return habilitado;
          })
          .map(menu => {
            const IconComponent = menuIcons[menu.nombreMenu] || FaCog;
            const id = menu.nombreMenu.toLowerCase().replace(/\s+/g, '-');
            
            console.log(`🎯 Mapeando: "${menu.nombreMenu}" → ID: "${id}"`);
            
            return {
              id: id,
              label: menu.nombreMenu,
              icon: IconComponent,
              originalId: menu.menuId
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        console.log('📋 Menús finales para sidebar:', mappedMenus);
        setMenuItems(mappedMenus);
        
      } catch (error) {
        console.error('❌ Error cargando menús:', error);
        // En caso de error, mostrar menú por defecto basado en el rol
        console.log('🔄 Usando menú por defecto para rol:', user.rol);
        setMenuItems(getDefaultMenu(user.rol));
      } finally {
        setLoading(false);
      }
    };

    loadUserMenus();
  }, [user]);

  // Menú por defecto en caso de error
  const getDefaultMenu = (userRole) => {
    const roleMenus = {
      "1": [ // Administrador - COMPLETO
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
      "2": [ // Doctor
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Mis Pacientes", icon: FaUser },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "3": [ // Paciente
        { id: "perfil", label: "Mi Perfil", icon: FaUser },
        { id: "agendar-cita", label: "Agendar Cita", icon: FaCalendar },
        { id: "mis-citas", label: "Mis Citas", icon: FaHeart },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ],
      "6": [ // Secretaria
        { id: "dashboard", label: "Dashboard", icon: FaChartBar },
        { id: "citas", label: "Citas", icon: FaCalendar },
        { id: "pacientes", label: "Pacientes", icon: FaUser },
        { id: "notificaciones", label: "Notificaciones", icon: FaBell }
      ]
    };

    return roleMenus[userRole] || [{ id: "dashboard", label: "Dashboard", icon: FaChartBar }];
  };

  // Mapeo de roles para mostrar
  const roleNames = {
    "1": "Administrador",
    "2": "Doctor", 
    "3": "Paciente",
    "6": "Secretaria"
  };

  const userRole = user?.rol?.toString() || "0";
  const roleName = roleNames[userRole] || "Sin rol";

  // Función para manejar clic en items
  const handleItemClick = (screenId) => {
    console.log('🔍 Sidebar - Clic en:', screenId);
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
            onClick={() => handleItemClick('configuracion')}
          >
            <FaCog className="sidebar-icon" />
            {(!collapsed || isMobileOpen) && (
              <span className="sidebar-label">Configuración</span>
            )}
          </button>
        </div>
      </div>

      {/* Overlay para móviles */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "mobile-open" : ""}`}
        onClick={onCloseMobile}
      />
    </>
  );
}