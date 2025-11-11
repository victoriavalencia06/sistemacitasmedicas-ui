import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CitaItem from './CitaItem';

const CitaList = ({ citas, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando citas...</p>
            </div>
        );
    }

    if (!citas || citas.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaCalendarAlt size={48} />
                </div>
                <h3 className="management-empty-title">No hay citas registradas</h3>
                <p className="management-empty-text">Comienza creando la primera cita en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            {/* ✅ HEADER AZUL IGUAL AL DE ROL */}
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Citas</h2>
                <p className="management-table-subtitle">
                    {citas.length} {citas.length === 1 ? 'cita registrada' : 'citas registradas'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Paciente</th>
                            <th>Doctor</th>
                            <th>Fecha y Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita) => (
                            <CitaItem
                                key={cita.idCita}
                                cita={cita}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitaList;