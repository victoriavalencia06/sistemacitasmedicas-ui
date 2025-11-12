import React from 'react';
import { FaUserInjured } from 'react-icons/fa';
import PacienteItem from './PacienteItem';

const PacienteList = ({ pacientes, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando pacientes...</p>
            </div>
        );
    }

    if (pacientes.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaUserInjured size={48} />
                </div>
                <h3 className="management-empty-title">No hay pacientes registrados</h3>
                <p className="management-empty-text">Comienza creando el primer paciente en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Pacientes</h2>
                <p className="management-table-subtitle">
                    {pacientes.length} {pacientes.length === 1 ? 'paciente registrado' : 'pacientes registrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Edad</th>
                            <th>Teléfono</th>
                            <th>Seguro</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente) => (
                            <PacienteItem
                                key={paciente.id}
                                paciente={paciente}
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

export default PacienteList;