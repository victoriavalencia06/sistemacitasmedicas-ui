import React from 'react';
import { FaUserMd } from 'react-icons/fa';
import DoctorItem from './DoctorItem';

const DoctorList = ({ doctores, loading, onEdit, onDelete, onActivate, onView }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando doctores...</p>
            </div>
        );
    }

    if (doctores.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaUserMd size={48} />
                </div>
                <h3 className="management-empty-title">No hay doctores registrados</h3>
                <p className="management-empty-text">Comienza creando el primer doctor en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Doctores</h2>
                <p className="management-table-subtitle">
                    {doctores.length} {doctores.length === 1 ? 'doctor encontrado' : 'doctores encontrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctores.map((doctor) => (
                            <DoctorItem
                                key={doctor.id}
                                doctor={doctor}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onActivate={onActivate}
                                onView={onView}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorList;