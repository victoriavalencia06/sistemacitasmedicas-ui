import React from 'react';
import { FaUsers } from 'react-icons/fa';
import UsuarioItem from './UsuarioItem';

const UsuarioList = ({ usuarios, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    if (!usuarios || usuarios.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaUsers size={48} />
                </div>
                <h3 className="management-empty-title">No hay usuarios registrados</h3>
                <p className="management-empty-text">Comienza creando el primer usuario en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            {/* ✅ HEADER AZUL IGUAL AL DE ROL */}
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Usuarios</h2>
                <p className="management-table-subtitle">
                    {usuarios.length} {usuarios.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <UsuarioItem
                                key={usuario._key || usuario.id}
                                usuario={usuario}
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

export default UsuarioList;