import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CitaItem = ({ cita, onEdit, onDelete }) => {
    return (
        <tr>
            <td><strong>#{cita.idCita}</strong></td>
            <td>{cita.pacienteNombre}</td>
            <td>{cita.doctorNombre}</td>
            <td>{cita.fechaHora}</td>
            <td>
                <span className={`status-badge ${cita.estadoDisplay === 'Activa' ? 'status-active' : 'status-inactive'}`}>
                    {cita.estadoDisplay}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button onClick={() => onEdit(cita)} className="btn-management btn-management-secondary">
                        <FaEdit /> Editar
                    </button>
                    <button onClick={() => onDelete(cita.idCita)} className="btn-management btn-management-danger">
                        <FaTrash /> Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CitaItem;