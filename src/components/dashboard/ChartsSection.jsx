import React from 'react';
import { FaChartBar, FaChartLine, FaUserInjured } from 'react-icons/fa';

const ChartsSection = ({ stats }) => {
    const appointmentData = [
        { day: 'Lun', appointments: 12 },
        { day: 'Mar', appointments: 8 },
        { day: 'Mié', appointments: 15 },
        { day: 'Jue', appointments: 10 },
        { day: 'Vie', appointments: 18 },
        { day: 'Sáb', appointments: 5 },
        { day: 'Dom', appointments: 2 }
    ];

    const specialtyData = [
        { specialty: 'Cardiología', patients: 45 },
        { specialty: 'Pediatría', patients: 32 },
        { specialty: 'Dermatología', patients: 28 },
        { specialty: 'Neurología', patients: 22 },
        { specialty: 'Ortopedia', patients: 18 }
    ];

    const maxAppointments = Math.max(...appointmentData.map(d => d.appointments));

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                    <FaChartBar className="me-2 text-primary" />
                    Estadísticas y Gráficas
                </h5>
            </div>
            <div className="card-body">
                <div className="mb-4">
                    <h6 className="d-flex align-items-center mb-3">
                        <FaChartLine className="me-2 text-success fs-6" />
                        Citas por Día (Esta Semana)
                    </h6>
                    <div className="chart-container">
                        <div className="d-flex align-items-end justify-content-between chart-bars">
                            {appointmentData.map((data, index) => (
                                <div key={index} className="chart-bar-container text-center">
                                    <div
                                        className="chart-bar bg-success bg-opacity-25 mx-auto"
                                        style={{
                                            height: `${(data.appointments / maxAppointments) * 100}%`,
                                            minHeight: '20px'
                                        }}
                                    >
                                        <span className="chart-value">{data.appointments}</span>
                                    </div>
                                    <div className="chart-label mt-1">
                                        <small className="text-muted">{data.day}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className="d-flex align-items-center mb-3">
                        <FaUserInjured className="me-2 text-info fs-6" />
                        Pacientes por Especialidad
                    </h6>
                    <div className="specialty-chart">
                        {specialtyData.map((data, index) => {
                            const totalPatients = specialtyData.reduce((sum, item) => sum + item.patients, 0);
                            const percentage = (data.patients / totalPatients) * 100;

                            return (
                                <div key={index} className="specialty-item mb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="specialty-name small">
                                            {data.specialty}
                                        </span>
                                        <span className="specialty-count fw-bold">
                                            {data.patients}
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div
                                            className="progress-bar bg-info"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                    <div className="row text-center">
                        <div className="col-4">
                            <div className="border-end">
                                <div className="fw-bold text-primary fs-5">{stats.todayAppointments}</div>
                                <small className="text-muted">Citas Hoy</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border-end">
                                <div className="fw-bold text-success fs-5">{stats.availableSlots}</div>
                                <small className="text-muted">Disponibles</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div>
                                <div className="fw-bold text-warning fs-5">78%</div>
                                <small className="text-muted">Ocupación</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;