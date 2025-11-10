import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const WelcomeCard = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <div className="card border-0 shadow-sm welcome-card">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <div className="welcome-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                            <FaUserCircle className="text-primary fs-2" />
                        </div>
                    </div>
                    <div className="col">
                        <h3 className="welcome-title mb-1">
                            {getGreeting()}, {user?.name || 'Usuario'}
                        </h3>
                        <p className="welcome-subtitle text-muted mb-0">
                            {user?.role === 'admin'
                                ? 'Que tengas un excelente día administrando la clínica.'
                                : 'Que tengas un buen día en el trabajo.'
                            }
                        </p>
                    </div>
                    <div className="col-auto">
                        <div className="current-date text-end">
                            <div className="date-day fs-4 fw-bold text-primary">
                                {new Date().getDate()}
                            </div>
                            <div className="date-month text-muted">
                                {new Date().toLocaleDateString('es-ES', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;