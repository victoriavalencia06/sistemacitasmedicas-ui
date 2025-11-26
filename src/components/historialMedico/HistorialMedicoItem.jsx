import React from 'react';
import { FaFileMedical, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const HistorialMedicoItem = ({ historial, onEdit, onDelete, onView }) => {
    const truncateText = (text, maxLength) => {
        if (!text) return 'No especificado';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <tr>
            <td>
                <strong>#{historial.id}</strong>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaFileMedical />
                        {historial.nombrePaciente}
                    </div>
                </div>
            </td>

            <td>
                Cita #{historial.idCita ?? 'N/A'}
            </td>

            <td>
                {historial.fechahora 
                    ? new Date(historial.fechahora).toLocaleDateString('es-ES')
                    : 'No especificada'}
            </td>

            <td>
                {truncateText(historial.diagnostico, 50)}
            </td>

            <td>
                <span className={`status-badge ${historial.estado ? 'status-active' : 'status-inactive'}`}>
                    {historial.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onView(historial)}
                        className="btn-management btn-management-secondary"
                        title="Ver detalles"
                    >
                        <FaEye /> Ver
                    </button>

                    <button
                        onClick={() => onEdit(historial)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit /> Editar
                    </button>

                    <button
                        onClick={() => onDelete(historial.id)}
                        className="btn-management btn-management-danger"
                    >
                        <FaTrash /> Desactivar
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default HistorialMedicoItem;