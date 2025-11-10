import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/styles/Dashboard.css';
import Roles from '../pages/Roles';
import Citas from '../pages/Citas';
import Usuarios from '../pages/Usuarios';

function Dashboard() {
    const [currentScreen, setCurrentScreen] = React.useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const { user, logout } = useContext(AuthContext);
    const userName = user?.nombre || "Usuario";

    const handleNavigate = (screen) => {
        console.log('🔄 Navegando a:', screen); // Para debug
        setCurrentScreen(screen);
        // En móviles, cerrar el menú después de navegar
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

    // Función para cerrar el sidebar en móvil
    const closeMobileSidebar = () => {
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    // Determinar si el sidebar debe mostrarse como colapsado
    const isSidebarCollapsed = window.innerWidth <= 768 ? !mobileMenuOpen : sidebarCollapsed;

    // Renderizar el contenido según la pantalla actual
    const renderContent = () => {
        console.log('🎯 Pantalla actual:', currentScreen); // Para debug

        switch (currentScreen) {
            case 'dashboard':
                return (
                    <div>
                        <h1>Bienvenido al Dashboard</h1>
                        <p>Hola, {userName}!</p>
                        {/* Aquí puedes agregar más contenido del dashboard */}
                    </div>
                );
            case 'appointments':
                return <div><h1>Citas</h1><p>Gestión de citas médicas</p></div>;
            case 'doctors':
                return <div><h1>Médicos</h1><p>Gestión de médicos</p></div>;
            case 'patients':
                return <div><h1>Pacientes</h1><p>Gestión de pacientes</p></div>;
            case 'roles':
                return <Roles />;
            case 'reports':
                return <div><h1>Reportes</h1><p>Reportes del sistema</p></div>;
            case 'notifications':
                return <div><h1>Notificaciones</h1><p>Gestión de notificaciones</p></div>;
            case 'citas':
                return <Citas />;
            case 'usuarios':
                return <Usuarios />;
            default:
                return (
                    <div>
                        <h1>Bienvenido al {currentScreen}</h1>
                    </div>
                );
        }
    };

    return (
        <div className={`dashboard-root ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
            <Sidebar
                userType={user?.role} // Usar el rol del usuario autenticado
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                collapsed={isSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                onCloseMobile={closeMobileSidebar}
            />

            <div className="dashboard-main">
                <Topbar
                    userType={user?.role}
                    onLogout={handleLogout}
                    collapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    currentScreen={currentScreen}
                />

                <div className="dashboard-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;