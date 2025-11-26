import React from 'react';
import { FaFileMedical } from 'react-icons/fa';
import HistorialMedicoItem from './HistorialMedicoItem';

const HistorialMedicoList = ({ historiales, loading, onEdit, onDelete, onView }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando historiales médicos...</p>
            </div>
        );
    }

    if (historiales.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaFileMedical size={48} />
                </div>
                <h3 className="management-empty-title">No hay historiales médicos registrados</h3>
                <p className="management-empty-text">Comienza creando el primer historial en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Historiales Médicos</h2>
                <p className="management-table-subtitle">
                    {historiales.length} {historiales.length === 1 ? 'historial registrado' : 'historiales registrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Paciente</th>
                            <th>Cita</th>
                            <th>Fecha</th>
                            <th>Diagnóstico</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historiales.map((historial) => (
                            <HistorialMedicoItem
                                key={historial._key ?? historial.id}
                                historial={historial}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onView={onView}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialMedicoList;
