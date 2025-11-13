import React, { useState, useEffect } from 'react';
import {
    FaUserMd, FaSave, FaPlus, FaTimes, FaExclamationCircle,
    FaIdCard, FaPhone, FaClock, FaUser
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const DoctorForm = ({ doctor = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        idUsuario: '',
        nombre: '',
        apellido: '',
        cedulaProfesional: '',
        telefono: '',
        horarioLocal: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (doctor) {
            let horarioLocal = '';
            try {
                if (doctor.horario) {
                    const d = new Date(doctor.horario);
                    const pad = n => String(n).padStart(2, '0');
                    horarioLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                }
            } catch (e) { horarioLocal = ''; }

            setFormData({
                idUsuario: doctor.idUsuario?.toString() ?? '',
                nombre: doctor.nombre ?? '',
                apellido: doctor.apellido ?? '',
                cedulaProfesional: doctor.cedulaProfesional ?? '',
                telefono: doctor.telefono ?? '',
                horarioLocal,
                estado: typeof doctor.estado !== 'undefined' ? !!doctor.estado : true
            });
        } else {
            setFormData({
                idUsuario: '',
                nombre: '',
                apellido: '',
                cedulaProfesional: '',
                telefono: '',
                horarioLocal: '',
                estado: true
            });
        }
    }, [doctor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleToggle = () => setFormData(prev => ({ ...prev, estado: !prev.estado }));

    const validateForm = () => {
        const newErrors = {};

        // Validar idUsuario (requerido y numérico)
        if (!formData.idUsuario || !formData.idUsuario.trim()) {
            newErrors.idUsuario = 'ID de Usuario requerido';
        } else if (!/^\d+$/.test(formData.idUsuario.trim())) {
            newErrors.idUsuario = 'ID de Usuario debe ser un número válido';
        }

        if (!formData.nombre || !formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
        if (!formData.apellido || !formData.apellido.trim()) newErrors.apellido = 'Apellido requerido';
        if (!formData.cedulaProfesional || !formData.cedulaProfesional.trim()) newErrors.cedulaProfesional = 'Cédula requerida';

        const digits = (formData.telefono || '').replace(/\D/g, '');
        if (!digits) newErrors.telefono = 'Teléfono requerido';
        else if (!/^\d{8}$/.test(digits)) newErrors.telefono = 'El teléfono debe tener 8 dígitos';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toIsoFromLocal = (localDatetime) => {
        if (!localDatetime) return null;
        const d = new Date(localDatetime);
        return d.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const horarioIso = formData.horarioLocal && formData.horarioLocal.trim() !== ''
            ? toIsoFromLocal(formData.horarioLocal)
            : new Date().toISOString();

        const payload = {
            ...(doctor?.id ? { idDoctor: doctor.id } : {}),
            idUsuario: Number(formData.idUsuario.trim()),
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            cedulaProfesional: formData.cedulaProfesional.trim(),
            telefono: (formData.telefono || '').replace(/\D/g, ''),
            horario: horarioIso,
            estado: formData.estado ? 1 : 0
        };

        if (doctor && payload.estado === 0) {
            const result = await Swal.fire({
                title: 'Vas a dejar el doctor inactivo',
                html: 'Si guardas este doctor como <strong>inactivo</strong>, no podrá ser asignado a citas. ¿Deseas continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar inactivo',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            });
            if (!result.isConfirmed) return;
        }

        onSubmit(payload);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUserMd style={{ marginRight: 8 }} />
                    {doctor ? 'Editar Doctor' : 'Crear Nuevo Doctor'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required"><FaUser /> ID de Usuario</label>
                            <input
                                type="text"
                                name="idUsuario"
                                value={formData.idUsuario}
                                onChange={handleChange}
                                className={`form-control ${errors.idUsuario ? 'error' : ''}`}
                                placeholder="Ej: 123"
                            />
                            {errors.idUsuario && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.idUsuario}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required">Nombre</label>
                            <input
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={`form-control ${errors.nombre ? 'error' : ''}`}
                                placeholder="Ej: Juan"
                            />
                            {errors.nombre && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.nombre}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required">Apellido</label>
                            <input
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className={`form-control ${errors.apellido ? 'error' : ''}`}
                                placeholder="Ej: Pérez"
                            />
                            {errors.apellido && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.apellido}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required"><FaIdCard /> Cédula Profesional</label>
                            <input
                                name="cedulaProfesional"
                                value={formData.cedulaProfesional}
                                onChange={handleChange}
                                className={`form-control ${errors.cedulaProfesional ? 'error' : ''}`}
                                placeholder="Ej: 12345678"
                            />
                            {errors.cedulaProfesional && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.cedulaProfesional}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required"><FaPhone /> Teléfono</label>
                            <input
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={`form-control ${errors.telefono ? 'error' : ''}`}
                                placeholder="Ej: 70807080"
                                maxLength="8"
                            />
                            {errors.telefono && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.telefono}
                                </div>
                            )}
                            <small className="text-muted">8 dígitos sin espacios ni guiones</small>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label"><FaClock /> Horario</label>
                            <input
                                type="datetime-local"
                                name="horarioLocal"
                                value={formData.horarioLocal}
                                onChange={handleChange}
                                className="form-control"
                            />
                            <small className="text-muted">Si lo dejas vacío, se usará la fecha/hora actual.</small>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Estado</label>
                    <div className="switch-container">
                        <label className="switch">
                            <input type="checkbox" checked={formData.estado} onChange={handleToggle} />
                            <span className="slider"></span>
                        </label>
                        <span className="switch-label">{formData.estado ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    {!formData.estado && (
                        <div className="inline-warning" role="status">
                            <strong>Atención:</strong> si guarda el doctor inactivo, no podrá ser asignado a citas.
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-management btn-management-secondary">
                        <FaTimes /> Cancelar
                    </button>
                    <button type="submit" className="btn-management">
                        {doctor ? <><FaSave /> Actualizar Doctor</> : <><FaPlus /> Crear Doctor</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorForm;