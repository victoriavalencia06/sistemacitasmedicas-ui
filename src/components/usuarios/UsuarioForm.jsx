import React, { useState, useEffect } from 'react';
import { FaUser, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        idRol: '',
        nombre: '',
        correo: '',
        password: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    // Lista de roles disponibles (deberías obtener esto de tu API)
    const roles = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Doctor' },
        { id: 3, nombre: 'Paciente' }
    ];

    useEffect(() => {
        if (usuario) {
            setFormData({
                idRol: usuario.idRol ?? '',
                nombre: usuario.nombre ?? '',
                correo: usuario.correo ?? '',
                password: '', // No cargar password en edición por seguridad
                estado: usuario.estado ?? true
            });
        } else {
            setFormData({ 
                idRol: '', 
                nombre: '', 
                correo: '', 
                password: '', 
                estado: true 
            });
        }
    }, [usuario]);

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
        
        if (!formData.idRol) {
            newErrors.idRol = 'El rol es requerido';
        }
        
        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.correo || !formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
            newErrors.correo = 'El correo no tiene un formato válido';
        }

        // Validar password solo en creación
        if (!usuario && (!formData.password || !formData.password.trim())) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!usuario && formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            idRol: Number(formData.idRol),
            nombre: formData.nombre.trim(),
            correo: formData.correo.trim(),
            estado: usuario ? (formData.estado ? 1 : 0) : 1
        };

        // Solo incluir password si estamos creando o si se proporcionó uno en edición
        if (formData.password.trim()) {
            payload.password = formData.password;
        }

        // Si estamos editando y el estado será inactivo -> pedir confirmación
        if (usuario && payload.estado === 0) {
            const result = await Swal.fire({
                title: 'Vas a dejar el usuario inactivo',
                html: 'Si guardas este usuario como <strong>inactivo</strong>, no podrá acceder al sistema. ¿Deseas continuar?',
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

        onSubmit(payload);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUser style={{ marginRight: 8 }} />
                    {usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h2>
                <p className="management-form-subtitle">
                    {usuario
                        ? 'Actualiza la información del usuario existente'
                        : 'Completa la información para crear un nuevo usuario'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="idRol" className="form-label required">
                        Rol
                    </label>
                    <select
                        id="idRol"
                        name="idRol"
                        value={formData.idRol}
                        onChange={handleChange}
                        className={`form-control ${errors.idRol ? 'error' : ''}`}
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map(rol => (
                            <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.idRol && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.idRol}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ej: Juan Pérez García"
                    />
                    {errors.nombre && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.nombre}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="correo" className="form-label required">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`form-control ${errors.correo ? 'error' : ''}`}
                        placeholder="Ej: usuario@ejemplo.com"
                    />
                    {errors.correo && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.correo}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label required">
                        {usuario ? 'Nueva Contraseña (dejar en blanco para mantener actual)' : 'Contraseña'}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${errors.password ? 'error' : ''}`}
                        placeholder={usuario ? "••••••" : "Ingresa la contraseña"}
                    />
                    {errors.password && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.password}
                        </div>
                    )}
                </div>

                {usuario ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Usuario</label>
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
                                <strong>Atención:</strong> si guarda el usuario inactivo, no podrá acceder al sistema.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Estado del Usuario</label>
                        <p className="text-muted">
                            Este usuario estará <strong>activo por defecto</strong>.
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
                        {usuario ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Usuario
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Usuario
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioForm;