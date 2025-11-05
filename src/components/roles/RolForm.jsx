// src/components/roles/RolForm.jsx
import React, { useState, useEffect } from 'react';
import { FaUserTag, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const RolForm = ({ rol, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        estado: true // UI uses boolean
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (rol) {
            // rol.estado puede venir como 1/0 o true/false desde API; convertir a boolean
            const estadoBool = rol.estado === 1 || rol.estado === true;
            setFormData({
                nombre: rol.nombre ?? '',
                estado: estadoBool
            });
        } else {
            setFormData({ nombre: '', estado: true });
        }
    }, [rol]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del rol es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Devuelve datos en forma UI (nombre, estado boolean). El page mapeará a DTO.
        onSubmit({
            nombre: formData.nombre.trim(),
            estado: formData.estado
        });
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUserTag style={{ marginRight: 8 }} />
                    {rol ? 'Editar Rol' : 'Crear Nuevo Rol'}
                </h2>
                <p className="management-form-subtitle">
                    {rol ? 'Actualiza la información del rol' : 'Completa la información para crear un nuevo rol'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">Nombre del Rol</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ej: Administrador, Doctor, Paciente..."
                    />
                    {errors.nombre && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.nombre}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Estado del Rol</label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="estado"
                            name="estado"
                            checked={formData.estado}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label htmlFor="estado" className="form-check-label">Rol activo</label>
                    </div>
                    <small className="text-muted">Los roles inactivos no podrán ser asignados a nuevos usuarios</small>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-management btn-management-secondary">
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button type="submit" className="btn-management">
                        {rol ? <><FaSave style={{ marginRight: 6 }} />Actualizar Rol</> : <><FaPlus style={{ marginRight: 6 }} />Crear Rol</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RolForm;
