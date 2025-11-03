import React, { useState } from "react";
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaStethoscope } from "react-icons/fa";

export default function Topbar({ userType, onLogout, collapsed, onToggle, currentScreen }) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const getUserDisplayName = () => {
        return userType === 'admin' ? 'Administrador' :
            userType === 'doctor' ? 'Médico' : 'Paciente';
    };

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
                            border: '1px solid transparent',
                            color: 'var(--accent)'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-soft)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <FaUserCircle className="fs-5" />
                        <span className="fw-semibold">{getUserDisplayName()}</span>
                    </button>

                    {showUserMenu && (
                        <div className="dropdown-menu show position-absolute end-0 mt-1 shadow border-0"
                            style={{
                                minWidth: '220px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                            <div className="dropdown-header bg-light d-flex align-items-center gap-3 p-3 border-bottom">
                                <FaUserCircle className="fs-4 text-primary" />
                                <div>
                                    <div className="fw-semibold text-dark">{getUserDisplayName()}</div>
                                    <div className="text-muted small">usuario@medicitas.com</div>
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
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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

// Función helper para obtener el título de la página actual
function getCurrentPageTitle(currentScreen) {
    const titles = {
        'dashboard': 'Dashboard',
        'appointments': 'Citas',
        'patients': 'Pacientes',
        'doctors': 'Médicos',
        'reports': 'Reportes',
        'notifications': 'Notificaciones',
        'profile': 'Mi Perfil',
        'book-appointment': 'Agendar Cita',
        'my-appointments': 'Mis Citas'
    };
    return titles[currentScreen] || 'Dashboard';
}