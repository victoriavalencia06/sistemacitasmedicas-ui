import React, { useState, useEffect } from 'react';
import {
    FaUserMd, FaSave, FaPlus, FaTimes, FaExclamationCircle,
    FaIdCard, FaPhone, FaClock, FaUser, FaEnvelope, FaLock
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const DoctorForm = ({ doctor = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        // Datos del usuario
        correo: '',
        password: '',
        confirmPassword: '',
        // idRol siempre será 2 (doctor)
        idRol: 2,
        
        // Datos del doctor
        nombre: '',
        apellido: '',
        cedulaProfesional: '',
        telefono: '',
        horarioLocal: ''
    });
    const [errors, setErrors] = useState({});
    const [isEditing] = useState(!!doctor);

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
                correo: doctor.correo ?? '',
                password: '',
                confirmPassword: '',
                // Siempre 2, incluso en edición
                idRol: 2,
                nombre: doctor.nombre ?? '',
                apellido: doctor.apellido ?? '',
                cedulaProfesional: doctor.cedulaProfesional ?? '',
                telefono: doctor.telefono ?? '',
                horarioLocal
            });
        } else {
            setFormData({
                correo: '',
                password: '',
                confirmPassword: '',
                idRol: 2,
                nombre: '',
                apellido: '',
                cedulaProfesional: '',
                telefono: '',
                horarioLocal: ''
            });
        }
    }, [doctor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar datos del usuario
        if (!formData.correo || !formData.correo.trim()) {
            newErrors.correo = 'Correo electrónico requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Correo electrónico inválido';
        }

        if (!isEditing) {
            if (!formData.password) {
                newErrors.password = 'Contraseña requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        } else {
            // En edición, validar contraseña solo si se proporciona
            if (formData.password && formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
            if (formData.password && formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        // Validar datos del doctor
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
            correo: formData.correo.trim(),
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            cedulaProfesional: formData.cedulaProfesional.trim(),
            telefono: (formData.telefono || '').replace(/\D/g, ''),
            horario: horarioIso,
            idRol: 2 // Siempre 2
        };

        // Solo incluir password si se proporciona
        if (formData.password) {
            payload.password = formData.password;
        }

        // Para edición, el backend espera los IDs en el payload
        if (doctor) {
            payload.idDoctor = doctor.id;
            payload.idUsuario = doctor.idUsuario;
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
                <p className="management-form-subtitle">
                    {doctor ? 'Actualiza la información del doctor y su usuario' : 'Completa la información del doctor y crea su usuario'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                {/* Sección de Datos del Usuario */}
                <div className="form-section">
                    <h4 className="form-section-title">
                        <FaUser style={{ marginRight: 8 }} />
                        Datos de Usuario
                    </h4>
                    
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form-label required">
                                    <FaEnvelope style={{ marginRight: 6 }} /> 
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className={`form-control ${errors.correo ? 'error' : ''}`}
                                    placeholder="ejemplo@correo.com"
                                />
                                {errors.correo && (
                                    <div className="form-error">
                                        <FaExclamationCircle /> {errors.correo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className={`form-label ${!isEditing ? 'required' : ''}`}>
                                    <FaLock style={{ marginRight: 6 }} />
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    placeholder={isEditing ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
                                />
                                {errors.password && (
                                    <div className="form-error">
                                        <FaExclamationCircle /> {errors.password}
                                    </div>
                                )}
                                <small className="text-muted">
                                    {isEditing ? 'Solo completa si deseas cambiar la contraseña' : 'La contraseña debe tener al menos 6 caracteres'}
                                </small>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className={`form-label ${!isEditing ? 'required' : ''}`}>
                                    <FaLock style={{ marginRight: 6 }} />
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Repite la contraseña"
                                />
                                {errors.confirmPassword && (
                                    <div className="form-error">
                                        <FaExclamationCircle /> {errors.confirmPassword}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información del Rol (solo informativo) */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form-label">Rol del Usuario</label>
                                <div className="role-info-display">
                                    <span className="role-badge doctor-role">
                                        <FaUserMd style={{ marginRight: 6 }} />
                                        Doctor
                                    </span>
                                    <small className="text-muted">
                                        Todos los doctores se crean con el rol "Doctor" automáticamente
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Datos del Doctor */}
                <div className="form-section">
                    <h4 className="form-section-title">
                        <FaUserMd style={{ marginRight: 8 }} />
                        Datos del Doctor
                    </h4>

                    <div className="row">
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
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label required">
                                    <FaIdCard style={{ marginRight: 6 }} /> 
                                    Cédula Profesional
                                </label>
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

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label required">
                                    <FaPhone style={{ marginRight: 6 }} /> 
                                    Teléfono
                                </label>
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
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaClock style={{ marginRight: 6 }} /> 
                                    Horario
                                </label>
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