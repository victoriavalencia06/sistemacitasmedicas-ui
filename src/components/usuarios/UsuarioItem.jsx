import React from 'react';
import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';

const UsuarioItem = ({ usuario, onEdit, onDelete }) => {
    const getRolNombre = (idRol) => {
        const roles = {
            1: 'Administrador',
            2: 'Doctor', 
            3: 'Paciente'
        };
        return roles[idRol] || `Rol ${idRol}`;
    };

    return (
        <tr>
            <td>
                <strong>#{usuario.id}</strong>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUser />
                        {usuario.nombre}
                    </div>
                </div>
            </td>
            <td>
                <span className="text-muted">{usuario.correo}</span>
            </td>
            <td>
                <span className={`role-badge ${getRolNombre(usuario.idRol).toLowerCase()}`}>
                    {getRolNombre(usuario.idRol)}
                </span>
            </td>
            <td>
                <span className={`status-badge ${usuario.estado ? 'status-active' : 'status-inactive'}`}>
                    {usuario.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(usuario)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(usuario.id)}
                        className="btn-management btn-management-danger"
                    >
                        <FaTrash />
                        Desactivar
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default UsuarioItem;