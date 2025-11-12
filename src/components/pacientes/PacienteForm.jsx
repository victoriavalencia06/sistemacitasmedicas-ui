import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PacienteForm = ({ paciente, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        idUsuario: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
        direccion: '',
        seguro: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (paciente) {
            setFormData({
                idUsuario: paciente.idUsuario ?? '',
                nombre: paciente.nombre ?? '',
                apellido: paciente.apellido ?? '',
                fechaNacimiento: paciente.fechaNacimiento ? paciente.fechaNacimiento.split('T')[0] : '',
                telefono: paciente.telefono ?? '',
                direccion: paciente.direccion ?? '',
                seguro: paciente.seguro ?? '',
                estado: paciente.estado ?? true
            });
        } else {
            setFormData({ 
                idUsuario: '',
                nombre: '', 
                apellido: '', 
                fechaNacimiento: '', 
                telefono: '', 
                direccion: '', 
                seguro: '', 
                estado: true 
            });
        }
    }, [paciente]);

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
        
        if (!formData.idUsuario || !formData.idUsuario.toString().trim()) {
            newErrors.idUsuario = 'El ID de usuario es requerido';
        } else if (!/^\d+$/.test(formData.idUsuario.toString().trim())) {
            newErrors.idUsuario = 'El ID de usuario debe ser un número';
        }

        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.apellido || !formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        } else if (formData.apellido.trim().length < 2) {
            newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
        }

        if (!formData.fechaNacimiento) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
        } else {
            const birthDate = new Date(formData.fechaNacimiento);
            const today = new Date();
            if (birthDate >= today) {
                newErrors.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy';
            }
        }

        if (!formData.telefono || !formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{8}$/.test(formData.telefono.trim())) {
            newErrors.telefono = 'El teléfono debe tener 8 dígitos';
        }

        if (!formData.direccion || !formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        } else if (formData.direccion.trim().length < 5) {
            newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
        }

        if (!formData.seguro || !formData.seguro.trim()) {
            newErrors.seguro = 'El seguro es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // PAYLOAD CORREGIDO - Incluye idPaciente y estado como número
        const payload = {
            idPaciente: 0, // ← AGREGADO: Para crear siempre es 0
            idUsuario: parseInt(formData.idUsuario) || 0,
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            fechaNacimiento: formData.fechaNacimiento,
            telefono: formData.telefono.trim(),
            direccion: formData.direccion.trim(),
            seguro: formData.seguro.trim(),
            estado: paciente ? (formData.estado ? 1 : 0) : 1 // ← CORREGIDO: como número (1 o 0)
        };

        if (paciente && payload.estado === 0) {
            const result = await Swal.fire({
                title: 'Vas a dejar el paciente inactivo',
                html: 'Si guardas este paciente como <strong>inactivo</strong>, no podrá ser utilizado en el sistema. ¿Deseas continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar inactivo',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        // Para edición, actualizar el idPaciente
        if (paciente && paciente.id) {
            payload.idPaciente = paciente.id;
        }

        onSubmit(payload);
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUserInjured style={{ marginRight: 8 }} />
                    {paciente ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
                </h2>
                <p className="management-form-subtitle">
                    {paciente
                        ? 'Actualiza la información del paciente existente'
                        : 'Completa la información para crear un nuevo paciente'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="idUsuario" className="form-label required">
                        ID de Usuario
                    </label>
                    <input
                        type="number"
                        id="idUsuario"
                        name="idUsuario"
                        value={formData.idUsuario}
                        onChange={handleChange}
                        className={`form-control ${errors.idUsuario ? 'error' : ''}`}
                        placeholder="Ej: 2, 9, 110, 111, 115, 116"
                        min="1"
                    />
                    {errors.idUsuario && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.idUsuario}
                        </div>
                    )}
                    <div className="form-hint">
                         Usa uno de estos IDs existentes: 2, 9, 110, 111, 115, 116
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label required">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`form-control ${errors.nombre ? 'error' : ''}`}
                            placeholder="Ej: Juan"
                        />
                        {errors.nombre && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.nombre}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellido" className="form-label required">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className={`form-control ${errors.apellido ? 'error' : ''}`}
                            placeholder="Ej: Pérez"
                        />
                        {errors.apellido && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.apellido}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="fechaNacimiento" className="form-label required">
                        Fecha de Nacimiento
                    </label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className={`form-control ${errors.fechaNacimiento ? 'error' : ''}`}
                    />
                    {formData.fechaNacimiento && (
                        <div className="form-hint">
                            Edad: {calculateAge(formData.fechaNacimiento)} años
                        </div>
                    )}
                    {errors.fechaNacimiento && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.fechaNacimiento}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="telefono" className="form-label required">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`form-control ${errors.telefono ? 'error' : ''}`}
                        placeholder="Ej: 12345678"
                        maxLength="8"
                    />
                    {errors.telefono && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.telefono}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="direccion" className="form-label required">
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className={`form-control ${errors.direccion ? 'error' : ''}`}
                        placeholder="Ej: Av. Principal #123, Ciudad"
                    />
                    {errors.direccion && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.direccion}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="seguro" className="form-label required">
                        Seguro Médico
                    </label>
                    <input
                        type="text"
                        id="seguro"
                        name="seguro"
                        value={formData.seguro}
                        onChange={handleChange}
                        className={`form-control ${errors.seguro ? 'error' : ''}`}
                        placeholder="Ej: Seguro Social, Privado, etc."
                    />
                    {errors.seguro && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.seguro}
                        </div>
                    )}
                </div>

                {paciente ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Paciente</label>
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
                                <strong>Atención:</strong> si guarda el paciente inactivo, no podrá ser usado en el sistema.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Estado del Paciente</label>
                        <p className="text-muted">
                            Este paciente está <strong>activo por defecto</strong>.
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
                        {paciente ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Paciente
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Paciente
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PacienteForm;