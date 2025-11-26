import React, { useEffect, useState, useCallback } from 'react';
import {
    FaUsers,
    FaCalendarCheck,
    FaCalendarPlus,
    FaCalendarAlt,
    FaSync,
    FaExclamationTriangle
} from 'react-icons/fa';
import statsService from '../../services/statsService';

const numberFormatter = new Intl.NumberFormat('es-ES');

const StatsCards = ({ stats: externalStats = null, onRetry: externalOnRetry = null, slotsPerDay = 20 }) => {
    // Estado interno para controlar carga cuando el componente se encarga de traer los datos
    const [stats, setStats] = useState({
        loading: !!!externalStats,
        error: null,
        totalPatients: 0,
        todayAppointments: 0,
        availableSlots: 0,
        consultationsThisMonth: 0
    });

    // Si el parent pasa stats (y no quiere que el componente haga fetch), usarlas
    useEffect(() => {
        if (externalStats) {
            setStats({
                loading: false,
                error: externalStats.error ?? null,
                totalPatients: Number(externalStats.totalPatients ?? 0),
                todayAppointments: Number(externalStats.todayAppointments ?? 0),
                availableSlots: Number(externalStats.availableSlots ?? 0),
                consultationsThisMonth: Number(externalStats.consultationsThisMonth ?? 0)
            });
        }
    }, [externalStats]);

    const load = useCallback(async (opts = {}) => {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        try {
            const overview = await statsService.getOverview({ date: opts.date ?? new Date(), slotsPerDay: opts.slotsPerDay ?? slotsPerDay });
            setStats({
                loading: false,
                error: null,
                totalPatients: Number(overview.totalPatients ?? 0),
                todayAppointments: Number(overview.todayAppointments ?? 0),
                availableSlots: Number(overview.availableSlots ?? 0),
                consultationsThisMonth: Number(overview.consultationsThisMonth ?? 0)
            });
        } catch (err) {
            console.error('Error cargando stats:', err);
            setStats(prev => ({ ...prev, loading: false, error: err?.message || 'No se pudieron cargar estadísticas' }));
        }
    }, [slotsPerDay]);

    // Si no se pasó externalStats, cargar al montar
    useEffect(() => {
        if (!externalStats) {
            load();
        }
    }, [externalStats, load]);

    // Cuando el usuario pulsa reintentar: priorizar externalOnRetry si existe (para que el padre controle)
    const handleRetry = async () => {
        if (typeof externalOnRetry === 'function') {
            try {
                externalOnRetry(); // el padre puede volver a cargar su estado
            } catch (e) {
                // ignore
            }
        }
        await load();
    };

    // Construcción de las cards (valores leídos del state interno 'stats')
    const statCards = [
        {
            id: 1,
            title: 'Pacientes Totales',
            valueKey: 'totalPatients',
            icon: FaUsers,
            color: 'blue-primary',
            description: 'Pacientes registrados',
            bgColor: 'blue-soft'
        },
        {
            id: 2,
            title: 'Citas Hoy',
            valueKey: 'todayAppointments',
            icon: FaCalendarCheck,
            color: 'teal',
            description: 'Citas programadas para hoy',
            bgColor: 'teal-soft'
        },
        {
            id: 3,
            title: 'Cupos Disponibles',
            valueKey: 'availableSlots',
            icon: FaCalendarPlus,
            color: 'blue-light',
            description: 'Cupos libres hoy',
            bgColor: 'blue-light-soft'
        },
        {
            id: 4,
            title: 'Citas del Mes',
            valueKey: 'consultationsThisMonth',
            icon: FaCalendarAlt,
            color: 'accent',
            description: 'Total de citas este mes',
            bgColor: 'accent-soft'
        }
    ];

    // Render loading state
    if (stats.loading) {
        return (
            <div className="row g-3">
                {[1, 2, 3, 4].map(id => (
                    <div key={id} className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className="card border-0 shadow-sm stat-card h-100">
                            <div className="card-body d-flex align-items-center justify-content-center" role="status" aria-live="polite">
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

    // Render error state
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
                                onClick={handleRetry}
                                aria-label="Reintentar carga de estadísticas"
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

    // Render normal
    return (
        <div className="row g-3">
            {statCards.map((card) => {
                const Icon = card.icon;
                const rawValue = stats?.[card.valueKey];
                const displayValue =
                    rawValue === null || rawValue === undefined
                        ? '0'
                        : Number.isFinite(Number(rawValue))
                            ? numberFormatter.format(Number(rawValue))
                            : String(rawValue);

                return (
                    <div key={card.id} className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className={`card border-0 shadow-sm stat-card h-100 stat-card-${card.color}`}>
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <div className={`stat-icon bg-${card.bgColor} rounded-circle me-3`} aria-hidden="true" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon className={`text-${card.color} fs-4`} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="card-title text-text-secondary mb-1">
                                            {card.title}
                                        </h6>
                                        <h3 className="mb-0 fw-bold text-text-primary">{displayValue}</h3>
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
                );
            })}
        </div>
    );
};

export default StatsCards;