import React, { useState, useEffect } from 'react';
import {
    FaFileMedical, FaSave, FaPlus, FaTimes, FaExclamationCircle,
    FaUserInjured, FaCalendarAlt, FaStethoscope, FaPills, FaNotesMedical,
    FaAllergies, FaProcedures
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const HistorialMedicoForm = ({ historial = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        idPaciente: '',
        idCita: '',
        notas: '',
        diagnostico: '',
        tratamientos: '',
        cuadroMedico: '',
        alergias: '',
        antecedentesFamiliares: '',
        observaciones: '',
        estado: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (historial) {
            setFormData({
                idPaciente: historial.idPaciente?.toString() ?? '',
                idCita: historial.idCita?.toString() ?? '',
                notas: historial.notas ?? '',
                diagnostico: historial.diagnostico ?? '',
                tratamientos: historial.tratamientos ?? '',
                cuadroMedico: historial.cuadroMedico ?? '',
                alergias: historial.alergias ?? '',
                antecedentesFamiliares: historial.antecedentesFamiliares ?? '',
                observaciones: historial.observaciones ?? '',
                estado: typeof historial.estado !== 'undefined' ? !!historial.estado : true
            });
        } else {
            setFormData({
                idPaciente: '',
                idCita: '',
                notas: '',
                diagnostico: '',
                tratamientos: '',
                cuadroMedico: '',
                alergias: '',
                antecedentesFamiliares: '',
                observaciones: '',
                estado: true
            });
        }
    }, [historial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleToggle = () => setFormData(prev => ({ ...prev, estado: !prev.estado }));

    const validateForm = () => {
        const newErrors = {};

        if (!formData.idPaciente || !formData.idPaciente.trim()) {
            newErrors.idPaciente = 'ID de Paciente requerido';
        } else if (!/^\d+$/.test(formData.idPaciente.trim())) {
            newErrors.idPaciente = 'ID de Paciente debe ser un número válido';
        }

        if (!formData.idCita || !formData.idCita.trim()) {
            newErrors.idCita = 'ID de Cita requerido';
        } else if (!/^\d+$/.test(formData.idCita.trim())) {
            newErrors.idCita = 'ID de Cita debe ser un número válido';
        }

        if (!formData.diagnostico || !formData.diagnostico.trim()) {
            newErrors.diagnostico = 'Diagnóstico requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Corregir la fecha/hora para que coincida con la hora local
    const now = new Date();
    
    // Método 1: Ajustar a hora local
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
    
    const payload = {
        ...(historial?.id ? { idHistorialMedico: historial.id } : {}),
        idPaciente: Number(formData.idPaciente.trim()),
        idCita: Number(formData.idCita.trim()),
        notas: formData.notas.trim(),
        diagnostico: formData.diagnostico.trim(),
        tratamientos: formData.tratamientos.trim(),
        cuadroMedico: formData.cuadroMedico.trim(),
        alergias: formData.alergias.trim(),
        antecedentesFamiliares: formData.antecedentesFamiliares.trim(),
        observaciones: formData.observaciones.trim(),
        estado: formData.estado ? 1 : 0,
        fechaHora: localDateTime // Usar la fecha/hora corregida
    };

    if (historial && payload.estado === 0) {
        const result = await Swal.fire({
            title: 'Vas a dejar el historial inactivo',
            html: 'Si guardas este historial como <strong>inactivo</strong>, no estará disponible para consultas. ¿Deseas continuar?',
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
                    <FaFileMedical style={{ marginRight: 8 }} />
                    {historial ? 'Editar Historial Médico' : 'Crear Nuevo Historial Médico'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required"><FaUserInjured /> ID de Paciente</label>
                            <input
                                type="text"
                                name="idPaciente"
                                value={formData.idPaciente}
                                onChange={handleChange}
                                className={`form-control ${errors.idPaciente ? 'error' : ''}`}
                                placeholder="Ej: 123"
                            />
                            {errors.idPaciente && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.idPaciente}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label required"><FaCalendarAlt /> ID de Cita</label>
                            <input
                                type="text"
                                name="idCita"
                                value={formData.idCita}
                                onChange={handleChange}
                                className={`form-control ${errors.idCita ? 'error' : ''}`}
                                placeholder="Ej: 456"
                            />
                            {errors.idCita && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.idCita}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                            <label className="form-label required"><FaStethoscope /> Diagnóstico</label>
                            <textarea
                                name="diagnostico"
                                value={formData.diagnostico}
                                onChange={handleChange}
                                className={`form-control ${errors.diagnostico ? 'error' : ''}`}
                                placeholder="Ingrese el diagnóstico del paciente..."
                                rows="3"
                            />
                            {errors.diagnostico && (
                                <div className="form-error">
                                    <FaExclamationCircle /> {errors.diagnostico}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label"><FaPills /> Tratamientos</label>
                            <textarea
                                name="tratamientos"
                                value={formData.tratamientos}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Describa los tratamientos prescritos..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label"><FaNotesMedical /> Cuadro Médico</label>
                            <textarea
                                name="cuadroMedico"
                                value={formData.cuadroMedico}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Descripción del cuadro médico..."
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label"><FaAllergies /> Alergias</label>
                            <textarea
                                name="alergias"
                                value={formData.alergias}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Lista de alergias conocidas..."
                                rows="2"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label"><FaProcedures /> Antecedentes Familiares</label>
                            <textarea
                                name="antecedentesFamiliares"
                                value={formData.antecedentesFamiliares}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Antecedentes médicos familiares..."
                                rows="2"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label">Observaciones Generales</label>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Observaciones adicionales..."
                                rows="2"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                            <label className="form-label">Notas Adicionales</label>
                            <textarea
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Notas adicionales del historial..."
                                rows="2"
                            />
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
                            <strong>Atención:</strong> si guarda el historial inactivo, no estará disponible para consultas.
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-management btn-management-secondary">
                        <FaTimes /> Cancelar
                    </button>
                    <button type="submit" className="btn-management">
                        {historial ? <><FaSave /> Actualizar Historial</> : <><FaPlus /> Crear Historial</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HistorialMedicoForm;