import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/styles/Dashboard.css';

// Componentes del Dashboard
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsCards from '../components/dashboard/StatsCards';
import CalendarSection from '../components/dashboard/CalendarSection';
import ChartsSection from '../components/dashboard/ChartsSection';

// Páginas del sistema
import Roles from '../pages/Roles';
import Especializaciones from '../pages/Especializaciones';
// import Citas from '../pages/Citas';
// import Usuarios from '../pages/Usuarios';

function Dashboard() {
    const [currentScreen, setCurrentScreen] = React.useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        availableSlots: 0,
        consultationsThisMonth: 0
    });

    const { user, logout } = useContext(AuthContext);
    const userName = user?.nombre || "Usuario";

    useEffect(() => {
        if (currentScreen === 'dashboard') {
            loadDashboardData();
        }
    }, [currentScreen]);

    const loadDashboardData = async () => {
        // Simulación de carga de datos del dashboard
        setTimeout(() => {
            setStats({
                totalPatients: 156,
                todayAppointments: 8,
                availableSlots: 12,
                consultationsThisMonth: 45
            });
        }, 1000);
    };

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

        switch (currentScreen) {
            case 'dashboard':
                return (
                    <div className="dashboard-content-wrapper">
                        {/* Sección 1: Tarjeta de Bienvenida */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <WelcomeCard user={user} />
                            </div>
                        </div>

                        {/* Sección 2: Tarjetas de Estadísticas - TODAS EN UNA FILA */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <StatsCards stats={stats} />
                            </div>
                        </div>

                        {/* Sección 3: Calendario (OCUPA TODO EL ANCHO) */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <CalendarSection />
                            </div>
                        </div>

                        {/* Sección 4: Gráficas (OCUPA TODO EL ANCHO) */}
                        <div className="row">
                            <div className="col-12">
                                <ChartsSection stats={stats} />
                            </div>
                        </div>
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
            case 'especializaciones':
                return <Especializaciones />;
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
                userType={user?.role}
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