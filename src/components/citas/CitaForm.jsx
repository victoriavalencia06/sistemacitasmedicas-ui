import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSave, FaPlus, FaTimes, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const CitaForm = ({ cita, onSubmit, onCancel, usuarios, doctores, pacientes }) => {
    const [formData, setFormData] = useState({
        idUsuario: '',
        idPaciente: '',
        idDoctor: '',
        estado: true
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cita) {
            console.log('📋 Cita recibida para editar:', cita);
            setFormData({
                idUsuario: cita.idUsuario?.toString() || '',
                idPaciente: cita.idPaciente?.toString() || '',
                idDoctor: cita.idDoctor?.toString() || '',
                estado: cita.estado ?? true
            });
        } else {
            console.log('🆕 Creando nueva cita - formulario vacío');
            setFormData({
                idUsuario: '',
                idPaciente: '',
                idDoctor: '',
                estado: true
            });
        }
    }, [cita]);

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
        
        if (!formData.idUsuario) {
            newErrors.idUsuario = 'Debe seleccionar un usuario';
        }
        
        if (!formData.idPaciente) {
            newErrors.idPaciente = 'Debe seleccionar un paciente';
        }
        
        if (!formData.idDoctor) {
            newErrors.idDoctor = 'Debe seleccionar un doctor';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('✅ Formulario enviado, validando...');
        
        if (!validateForm()) {
            console.log('❌ Validación fallida, errores:', errors);
            return;
        }

        const payload = {
            idUsuario: formData.idUsuario,
            idPaciente: formData.idPaciente,
            idDoctor: formData.idDoctor,
            estado: formData.estado
        };

        // Si estamos editando, incluir la fecha original
        if (cita && cita.fechaHoraOriginal) {
            payload.fechaHoraOriginal = cita.fechaHoraOriginal;
        }

        console.log('📦 Payload a enviar:', payload);
        
        onSubmit(payload);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaCalendarAlt style={{ marginRight: 8 }} />
                    {cita ? 'Editar Cita' : 'Registrar Nueva Cita'}
                </h2>
                <p className="management-form-subtitle">
                    {cita ? 'Modifica los datos de la cita seleccionada' : 'Completa la información para agendar una nueva cita'}
                </p>
                
                <div className="info-alert">
                    <FaInfoCircle style={{ marginRight: 8, color: '#1890ff' }} />
                    <strong>Nota:</strong> La fecha y hora se establecerán automáticamente a la hora actual del sistema.
                </div>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="idUsuario" className="form-label required">Usuario</label>
                        <select
                            id="idUsuario"
                            name="idUsuario"
                            value={formData.idUsuario}
                            onChange={handleChange}
                            className={`form-control ${errors.idUsuario ? 'error' : ''}`}
                        >
                            <option value="">Seleccione un usuario</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                    {usuario.nombre || `Usuario ${usuario.idUsuario}`}
                                </option>
                            ))}
                        </select>
                        {errors.idUsuario && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idUsuario}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="idPaciente" className="form-label required">Paciente</label>
                        <select
                            id="idPaciente"
                            name="idPaciente"
                            value={formData.idPaciente}
                            onChange={handleChange}
                            className={`form-control ${errors.idPaciente ? 'error' : ''}`}
                        >
                            <option value="">Seleccione un paciente</option>
                            {pacientes.map(paciente => (
                                <option key={paciente.idPaciente} value={paciente.idPaciente}>
                                    {paciente.nombre || `Paciente ${paciente.idPaciente}`}
                                </option>
                            ))}
                        </select>
                        {errors.idPaciente && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idPaciente}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="idDoctor" className="form-label required">Doctor</label>
                        <select
                            id="idDoctor"
                            name="idDoctor"
                            value={formData.idDoctor}
                            onChange={handleChange}
                            className={`form-control ${errors.idDoctor ? 'error' : ''}`}
                        >
                            <option value="">Seleccione un doctor</option>
                            {doctores.map(doctor => (
                                <option key={doctor.idDoctor} value={doctor.idDoctor}>
                                    {doctor.nombre || `Doctor ${doctor.idDoctor}`}
                                </option>
                            ))}
                        </select>
                        {errors.idDoctor && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idDoctor}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Estado de la Cita</label>
                    <div className="switch-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={formData.estado}
                                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="switch-label">
                            {formData.estado ? 'Activa' : 'Cancelada'}
                        </span>
                    </div>
                    <small className="text-muted">Las citas canceladas no se mostrarán en la lista principal.</small>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-management btn-management-secondary">
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button type="submit" className="btn-management" disabled={loading}>
                        {loading ? (
                            'Procesando...'
                        ) : cita ? (
                            <><FaSave style={{ marginRight: 6 }} />Actualizar Cita</>
                        ) : (
                            <><FaPlus style={{ marginRight: 6 }} />Crear Cita</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CitaForm;