import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/styles/Dashboard.css';
import Roles from '../pages/Roles'; // Importa el componente Roles

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
                return <Appointments />;
            case 'doctors':
                return <Doctors />;
            case 'patients':
                return <Users />;
            case 'roles':
                return <Roles />;
            case 'reports':
                return <Reports />;
            case 'notifications':
                return <Notifications />;
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
                onToggle={toggleSidebar}
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