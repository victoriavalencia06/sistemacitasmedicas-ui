import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/styles/Dashboard.css';

// Componentes del Dashboard
import WelcomeCard from '../components/dashboard/WelcomeCard';
import CalendarSection from '../components/dashboard/CalendarSection';

// Páginas del sistema - TODAS DESCOMENTADAS
import Roles from '../pages/Roles';
import Especializaciones from '../pages/Especializaciones';
import Pacientes from '../pages/Pacientes';
import Citas from '../pages/Citas';
import Usuarios from '../pages/Usuarios';
import Doctor from '../pages/Doctor';

function Dashboard() {
    const [currentScreen, setCurrentScreen] = React.useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const { user, logout } = useContext(AuthContext);
    const userName = user?.nombre || "Usuario";

    useEffect(() => {
        if (currentScreen === 'dashboard') {
            // Código para cargar datos reales si es necesario
        }
    }, [currentScreen]);

    const handleNavigate = (screen) => {
        console.log('🔄 Navegando a:', screen);
        setCurrentScreen(screen);
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeMobileSidebar = () => {
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    const isSidebarCollapsed = window.innerWidth <= 768 ? !mobileMenuOpen : sidebarCollapsed;

    const renderContent = () => {
        console.log('🎯 Pantalla actual:', currentScreen);

        // ✅ SWITCH MEJORADO - maneja múltiples IDs y todos los componentes
        switch (currentScreen) {
            case 'dashboard':
            case 'inicio':
                return (
                    <div className="dashboard-content-wrapper">
                        <div className="row mb-4">
                            <div className="col-12">
                                <WelcomeCard user={user} />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12">
                                <CalendarSection />
                            </div>
                        </div>
                    </div>
                );

            case 'citas':
            case 'appointments':
                return (
                    <div className="page-container">
                        <Citas />
                    </div>
                );

            case 'pacientes':
            case 'patients':
                return (
                    <div className="page-container">
                        <Pacientes />
                    </div>
                );

            case 'medicos':
            case 'doctors':
            case 'doctor':
                return (
                    <div className="page-container">
                        <Doctor />
                    </div>
                );

            case 'usuarios':
            case 'users':
                return (
                    <div className="page-container">
                        <Usuarios />
                    </div>
                );

            case 'roles':
                return (
                    <div className="page-container">
                        <Roles />
                    </div>
                );

            case 'especializaciones':
                return (
                    <div className="page-container">
                        <Especializaciones />
                    </div>
                );

            case 'reportes':
            case 'reports':
                return (
                    <div className="page-container">
                        <h1>Reportes</h1>
                        <p>Reportes del sistema</p>
                    </div>
                );

            case 'notificaciones':
            case 'notifications':
                return (
                    <div className="page-container">
                        <h1>Notificaciones</h1>
                        <p>Gestión de notificaciones</p>
                    </div>
                );

            case 'perfil':
            case 'mi-perfil':
                return (
                    <div className="page-container">
                        <h1>Mi Perfil</h1>
                        <p>Gestión de perfil de usuario</p>
                    </div>
                );

            case 'agendar-cita':
                return (
                    <div className="page-container">
                        <h1>Agendar Cita</h1>
                        <p>Formulario para agendar nueva cita</p>
                    </div>
                );

            case 'mis-citas':
                return (
                    <div className="page-container">
                        <h1>Mis Citas</h1>
                        <p>Historial y gestión de mis citas</p>
                    </div>
                );

            case 'configuracion':
                return (
                    <div className="page-container">
                        <h1>Configuración</h1>
                        <p>Configuración del sistema</p>
                    </div>
                );

            default:
                return (
                    <div className="page-container" style={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px'
                    }}>
                        <h2>🔍 Pantalla no encontrada</h2>
                        <p>No se encontró configuración para: <strong>{currentScreen}</strong></p>
                        <button
                            onClick={() => handleNavigate('dashboard')}
                            className="btn btn-primary mt-2"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={`dashboard-root ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
            <Sidebar
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                collapsed={isSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                onCloseMobile={closeMobileSidebar}
            />

            <div className="dashboard-main">
                <Topbar
                    userName={userName}
                    userRole={user?.rol}
                    onLogout={handleLogout}
                    collapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    currentScreen={currentScreen}
                />

                <main className="dashboard-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;