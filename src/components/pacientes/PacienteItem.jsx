import React from 'react';
import { FaUserInjured, FaEdit, FaTrash } from 'react-icons/fa';

const PacienteItem = ({ paciente, onEdit, onDelete }) => {
    const calculateAge = (fechaNacimiento) => {
        const birthDate = new Date(fechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <tr>
            <td>
                <strong>#{paciente.id}</strong>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUserInjured />
                        {paciente.nombre} {paciente.apellido}
                    </div>
                </div>
            </td>
            <td>
                {calculateAge(paciente.fechaNacimiento)} años
            </td>
            <td>
                {paciente.telefono}
            </td>
            <td>
                {paciente.seguro}
            </td>
            <td>
                <span className={`status-badge ${paciente.estado ? 'status-active' : 'status-inactive'}`}>
                    {paciente.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(paciente)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(paciente.id)}
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

export default PacienteItem;