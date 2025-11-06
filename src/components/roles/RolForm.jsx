import React, { useState, useEffect } from 'react';
import { FaUserTag, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RolForm = ({ rol, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (rol) {
            setFormData({
                nombre: rol.nombre ?? '',
                estado: rol.estado ?? true
            });
        } else {
            setFormData({ nombre: '', estado: true });
        }
    }, [rol]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleToggle = () => {
        setFormData(prev => ({
            ...prev,
            estado: !prev.estado
        }));
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

    // Manejo de submit: si es edición y el rol quedará inactivo, mostrar confirmación
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            nombre: formData.nombre.trim(),
            estado: rol ? formData.estado : true
        };

        // Si estamos editando (rol existe) y el estado será inactivo -> pedir confirmación
        if (rol && payload.estado === false) {
            const result = await Swal.fire({
                title: 'Vas a dejar el rol inactivo',
                html: 'Si guardas este rol como <strong>inactivo</strong>, no podrá ser asignado ni utilizado en el sistema. ¿Deseas continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar inactivo',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            });

            if (!result.isConfirmed) {
                // El usuario canceló la acción de guardar inactivo
                return;
            }
        }

        // Si no se pidió confirmación o el usuario confirmó, enviamos
        onSubmit(payload);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUserTag style={{ marginRight: 8 }} />
                    {rol ? 'Editar Rol' : 'Crear Nuevo Rol'}
                </h2>
                <p className="management-form-subtitle">
                    {rol
                        ? 'Actualiza la información del rol existente'
                        : 'Completa la información para crear un nuevo rol'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                        Nombre del Rol
                    </label>
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

                {rol ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Rol</label>
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

                        {/* Mensaje inline cuando está inactivo para feedback inmediato */}
                        {!formData.estado && (
                            <div className="inline-warning" role="status">
                                <strong>Atención:</strong> si guarda el rol inactivo, no podrá ser usado ni asignado.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Estado del Rol</label>
                        <p className="text-muted">
                            Este rol está <strong>activo por defecto</strong>.
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
                        {rol ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Rol
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Rol
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RolForm;