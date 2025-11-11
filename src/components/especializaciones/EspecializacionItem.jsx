import React from 'react';
import { FaStethoscope, FaEdit, FaTrash } from 'react-icons/fa';

const EspecializacionItem = ({ especializacion, onEdit, onDelete }) => {
    return (
        <tr>
            <td>
                <strong>#{especializacion.id}</strong>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaStethoscope />
                        {especializacion.nombre}
                    </div>
                </div>
            </td>
            <td>
                <span className={`status-badge ${especializacion.estado ? 'status-active' : 'status-inactive'}`}>
                    {especializacion.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(especializacion)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(especializacion.id)}
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

export default EspecializacionItem;