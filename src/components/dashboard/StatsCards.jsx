import React from 'react';
import {
    FaUsers,
    FaCalendarCheck,
    FaCalendarPlus,
    FaCalendarAlt,
    FaSync,
    FaExclamationTriangle
} from 'react-icons/fa';

const StatsCards = ({ stats, onRetry }) => {
    const statCards = [
        {
            id: 1,
            title: 'Pacientes Totales',
            value: stats.totalPatients,
            icon: FaUsers,
            color: 'blue-primary',
            description: 'Pacientes registrados',
            bgColor: 'blue-soft'
        },
        {
            id: 2,
            title: 'Citas Hoy',
            value: stats.todayAppointments,
            icon: FaCalendarCheck,
            color: 'teal',
            description: 'Citas programadas para hoy',
            bgColor: 'teal-soft'
        },
        {
            id: 3,
            title: 'Cupos Disponibles',
            value: stats.availableSlots,
            icon: FaCalendarPlus,
            color: 'blue-light',
            description: 'Cupos libres hoy',
            bgColor: 'blue-light-soft'
        },
        {
            id: 4,
            title: 'Citas del Mes',
            value: stats.consultationsThisMonth,
            icon: FaCalendarAlt,
            color: 'accent',
            description: 'Total de citas este mes',
            bgColor: 'accent-soft'
        }
    ];

    if (stats.loading) {
        return (
            <div className="row g-3">
                {[1, 2, 3, 4].map(id => (
                    <div key={id} className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className="card border-0 shadow-sm stat-card h-100">
                            <div className="card-body d-flex align-items-center justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (stats.error) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <FaExclamationTriangle className="text-warning fs-1 mb-3" />
                            <h5 className="text-text-secondary">{stats.error}</h5>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={onRetry}
                            >
                                <FaSync className="me-2" />
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row g-3">
            {statCards.map((card) => (
                <div key={card.id} className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <div className={`card border-0 shadow-sm stat-card h-100 stat-card-${card.color}`}>
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <div className={`stat-icon bg-${card.bgColor} rounded-circle me-3`}>
                                    <card.icon className={`text-${card.color} fs-4`} />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="card-title text-text-secondary mb-1">
                                        {card.title}
                                    </h6>
                                    <h3 className="mb-0 fw-bold text-text-primary">{card.value}</h3>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <small className="text-muted">
                                    {card.description}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;