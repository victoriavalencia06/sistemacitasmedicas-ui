import React from 'react';
import { FaUsers } from 'react-icons/fa';
import RolItem from './RolItem';

const RolList = ({ roles, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando roles...</p>
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaUsers size={48} />
                </div>
                <h3 className="management-empty-title">No hay roles registrados</h3>
                <p className="management-empty-text">Comienza creando el primer rol en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Roles</h2>
                <p className="management-table-subtitle">
                    {roles.length} {roles.length === 1 ? 'rol registrado' : 'roles registrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((rol) => (
                            <RolItem
                                key={rol.id}
                                rol={rol}
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

export default RolList;
