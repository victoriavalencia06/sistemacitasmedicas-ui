import React from 'react';
import { FaUserMd, FaEdit, FaTrash, FaEye, FaCheckCircle } from 'react-icons/fa';

const DoctorItem = ({ doctor, onEdit, onDelete, onActivate, onView }) => {
    return (
        <tr>
            <td>
                <strong>#{doctor.id}</strong>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUserMd />
                        {doctor.nombre} {doctor.apellido}
                    </div>
                </div>
            </td>
            <td>
                {doctor.correo || 'No especificado'}
            </td>
            <td>
                {doctor.telefono || 'No especificado'}
            </td>
            <td>
                <span className={`status-badge ${doctor.estado ? 'status-active' : 'status-inactive'}`}>
                    {doctor.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onView(doctor)}
                        className="btn-management btn-management-secondary"
                        title="Ver detalles"
                    >
                        <FaEye />
                        Ver
                    </button>
                    <button
                        onClick={() => onEdit(doctor)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>
                    {doctor.estado ? (
                        <button
                            onClick={() => onDelete(doctor.id)}
                            className="btn-management btn-management-danger"
                        >
                            <FaTrash />
                            Desactivar
                        </button>
                    ) : (
                        <button
                            onClick={() => onActivate(doctor.id)}
                            className="btn-management btn-management-success"
                        >
                            <FaCheckCircle />
                            Activar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default DoctorItem;