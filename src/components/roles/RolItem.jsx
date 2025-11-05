import React from 'react';
import { FaUserTag, FaEdit, FaTrash } from 'react-icons/fa';

const RolItem = ({ rol, onEdit, onDelete }) => {
    return (
        <tr>
            <td>
                <strong>#{rol.id}</strong>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUserTag />
                        {rol.nombre}
                    </div>
                </div>
            </td>
            <td>
                <span className={`status-badge ${rol.estado ? 'status-active' : 'status-inactive'}`}>
                    {rol.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(rol)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(rol.id)}
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

export default RolItem;