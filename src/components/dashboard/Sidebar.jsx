import React from 'react';
import {
    FaCalendar,
    FaUser,
    FaUserMd,
    FaHeart,
    FaChartBar,
    FaCog,
    FaBell
} from 'react-icons/fa';

export default function Sidebar({ userType, currentScreen, onNavigate, collapsed }) {
    const getMenuItems = () => {
        if (userType === 'admin') {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
                { id: 'appointments', label: 'Citas', icon: FaCalendar },
                { id: 'patients', label: 'Pacientes', icon: FaUser },
                { id: 'doctors', label: 'Médicos', icon: FaUserMd },
                { id: 'reports', label: 'Reportes', icon: FaChartBar },
                { id: 'notifications', label: 'Notificaciones', icon: FaBell },
            ];
        } else if (userType === 'patient') {
            return [
                { id: 'profile', label: 'Mi Perfil', icon: FaUser },
                { id: 'book-appointment', label: 'Agendar Cita', icon: FaCalendar },
                { id: 'my-appointments', label: 'Mis Citas', icon: FaHeart },
                { id: 'notifications', label: 'Notificaciones', icon: FaBell },
            ];
        } else {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
                { id: 'appointments', label: 'Citas', icon: FaCalendar },
                { id: 'patients', label: 'Mis Pacientes', icon: FaUser },
                { id: 'notifications', label: 'Notificaciones', icon: FaBell },
            ];
        }
    };

    const menuItems = getMenuItems();

    const getUserDisplayName = () => {
        return userType === 'admin' ? 'Administrador' :
            userType === 'doctor' ? 'Médico' : 'Paciente';
    };

    return (
        <>
            <div className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Solo el rol del usuario en la sidebar */}
                {!collapsed && (
                    <div className="role-badge">
                        {getUserDisplayName()}
                    </div>
                )}

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentScreen === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                                title={collapsed ? item.label : ''}
                            >
                                <IconComponent className="sidebar-icon" />
                                {!collapsed && <span className="sidebar-label">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Section - Configuración */}
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