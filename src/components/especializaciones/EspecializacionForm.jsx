// src/components/especializaciones/EspecializacionForm.jsx
import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const EspecializacionForm = ({ especializacion, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (especializacion) {
            setFormData({
                nombre: especializacion.nombre ?? especializacion.Nombre ?? '',
                descripcion: especializacion.descripcion ?? especializacion.Descripcion ?? '',
                estado: typeof especializacion.estado !== 'undefined' ? especializacion.estado : true
            });
        } else {
            setFormData({ nombre: '', descripcion: '', estado: true });
        }
    }, [especializacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleToggle = () => {
        setFormData(prev => ({ ...prev, estado: !prev.estado }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre de la especialización es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (formData.descripcion && formData.descripcion.trim().length > 0 && formData.descripcion.trim().length < 5) {
            newErrors.descripcion = 'La descripción, si se proporciona, debe tener al menos 5 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Este es el submit del propio componente: construye un payload simple y
    // delega la acción real (llamada a API, añadir id, etc.) al padre mediante onSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion?.trim() ?? '',
            estado: formData.estado
        };

        // Si estamos editando y vamos a dejar inactiva, pedir confirmación (igual que en RolForm)
        if (especializacion && payload.estado === false) {
            const result = await Swal.fire({
                title: 'Vas a dejar la especialización inactiva',
                html: 'Si guardas esta especialización como <strong>inactiva</strong>, no podrá ser asignada ni utilizada en el sistema. ¿Deseas continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar inactiva',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            });

            if (!result.isConfirmed) return;
        }

        // Delegamos al padre la acción real (ej. construir Nombre/Descripcion/Estado y llamar al servicio)
        onSubmit(payload);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaStethoscope style={{ marginRight: 8 }} />
                    {especializacion ? 'Editar Especialización' : 'Crear Nueva Especialización'}
                </h2>
                <p className="management-form-subtitle">
                    {especializacion
                        ? 'Actualiza la información de la especialización existente'
                        : 'Completa la información para crear una nueva especialización'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                        Nombre de la Especialización
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ej: Cardiología, Pediatría, Dermatología..."
                    />
                    {errors.nombre && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.nombre}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={`form-control ${errors.descripcion ? 'error' : ''}`}
                        placeholder="Descripción breve de la especialización (opcional)"
                        rows={3}
                    />
                    {errors.descripcion && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.descripcion}
                        </div>
                    )}
                </div>

                {especializacion ? (
                    <div className="form-group">
                        <label className="form-label">Estado de la Especialización</label>
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={formData.estado}
                                    onChange={handleToggle}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="switch-label">
                                {formData.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        {!formData.estado && (
                            <div className="inline-warning" role="status">
                                <strong>Atención:</strong> si guarda la especialización inactiva, no podrá ser usada ni asignada.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Estado de la Especialización</label>
                        <p className="text-muted">
                            Esta especialización está <strong>activa por defecto</strong>.
                        </p>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-management btn-management-secondary"
                    >
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button type="submit" className="btn-management">
                        {especializacion ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Especialización
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Especialización
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EspecializacionForm;