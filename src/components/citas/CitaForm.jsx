import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSave, FaPlus, FaTimes, FaExclamationCircle, FaInfoCircle, FaClock } from 'react-icons/fa';
import citaService from '../../services/citaService'; // si necesitas la utilidad isoToDatetimeLocalInput directamente

const CitaForm = ({ cita, onSubmit, onCancel, usuarios, doctores, pacientes }) => {
    const [formData, setFormData] = useState({
        idUsuario: '',
        idPaciente: '',
        idDoctor: '',
        fechaHora: '', // valor para input datetime-local (YYYY-MM-DDTHH:mm)
        estado: true
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Utilidad: convierte ISO (backend) -> valor para input datetime-local (local)
    const isoToDatetimeLocalInput = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const local = new Date(d.getTime() - tzOffset);
        return local.toISOString().slice(0, 16);
    };

    // Utilidad: obtener ahora en formato local para datetime-local
    const nowLocalForInput = () => {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        const local = new Date(d.getTime() - tzOffset);
        return local.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (cita) {
            // si cita trae fecha (ISO del backend), convertir a valor local para el input
            setFormData({
                idUsuario: cita.idUsuario?.toString() || '',
                idPaciente: cita.idPaciente?.toString() || '',
                idDoctor: cita.idDoctor?.toString() || '',
                fechaHora: isoToDatetimeLocalInput(cita.fechaHora || cita.fechaHoraOriginal),
                estado: (cita.estado === 1 || cita.estado === true) ? true : false
            });
        } else {
            setFormData({
                idUsuario: '',
                idPaciente: '',
                idDoctor: '',
                fechaHora: nowLocalForInput(),
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

        if (!formData.idUsuario) newErrors.idUsuario = 'Debe seleccionar un usuario';
        if (!formData.idPaciente) newErrors.idPaciente = 'Debe seleccionar un paciente';
        if (!formData.idDoctor) newErrors.idDoctor = 'Debe seleccionar un doctor';
        if (!formData.fechaHora) newErrors.fechaHora = 'Debe seleccionar fecha y hora';
        else {
            // Comprobación básica: no permitir fecha en pasado (comparando instantes)
            const selectedDate = new Date(formData.fechaHora);
            const now = new Date();
            // selectedDate here is parsed as local; compare against now local
            if (selectedDate < now) newErrors.fechaHora = 'No puede seleccionar una fecha y hora pasadas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            idUsuario: formData.idUsuario,
            idPaciente: formData.idPaciente,
            idDoctor: formData.idDoctor,
            fechaHora: formData.fechaHora, // valor local "YYYY-MM-DDTHH:mm"; service lo convertirá a UTC ISO
            estado: formData.estado
        };

        // si edicion, incluir fechaHoraOriginal si existe
        if (cita && cita.fechaHoraOriginal) payload.fechaHoraOriginal = cita.fechaHoraOriginal;

        setLoading(true);
        try {
            await onSubmit(payload);
        } finally {
            setLoading(false);
        }
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
                    <strong>Nota:</strong> Seleccione la fecha y hora deseada para la cita.
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
                    <label htmlFor="fechaHora" className="form-label required">
                        <FaClock style={{ marginRight: 6 }} />
                        Fecha y Hora de la Cita
                    </label>
                    <input
                        type="datetime-local"
                        id="fechaHora"
                        name="fechaHora"
                        value={formData.fechaHora}
                        onChange={handleChange}
                        className={`form-control ${errors.fechaHora ? 'error' : ''}`}
                        min={nowLocalForInput()}
                    />
                    {errors.fechaHora && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.fechaHora}
                        </div>
                    )}
                    <small className="text-muted">
                        Seleccione la fecha y hora deseada para la cita. No se permiten fechas pasadas.
                    </small>
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