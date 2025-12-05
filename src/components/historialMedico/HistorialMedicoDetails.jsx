import React from 'react';
import {
    FaFileMedical,
    FaUserInjured,
    FaCalendarAlt,
    FaStethoscope,
    FaPills,
    FaNotesMedical,
    FaTimes,
    FaAllergies,
    FaProcedures
} from 'react-icons/fa';

const HistorialMedicoDetails = ({ historial, onClose }) => {
    const formatFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        try {
            const date = new Date(fecha);

            // Si la fecha viene en UTC pero quieres mostrar hora local
            return date.toLocaleString('es-ES', {
                timeZone: 'America/Mexico_City', // Ajusta según tu zona horaria
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return 'Formato inválido';
        }
    };

    if (!historial) return null;

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <h2 className="management-form-title mb-1">
                            <FaFileMedical style={{ marginRight: 8 }} />
                            Detalles del Historial Médico
                        </h2>
                        <p className="management-form-subtitle mb-0">
                            Información completa del historial médico
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-management btn-management-secondary"
                        style={{ padding: '8px 12px' }}
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            <div className="management-form">
                {/* Primera fila - Información Básica */}
                <div className="row">
                    <div className="col-12">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaUserInjured className="me-2" />
                                Información Básica
                            </h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="detail-item">
                                        <label>ID del Historial:</label>
                                        <span className="detail-value">#{historial.id}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="detail-item">
                                        <label><FaUserInjured className="me-1" />Paciente:</label>
                                        <span className="detail-value">#{historial.nombrePaciente}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="detail-item">
                                        <label><FaCalendarAlt className="me-1" /> ID Cita:</label>
                                        <span className="detail-value">#{historial.idCita}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="detail-item">
                                        <label>Estado:</label>
                                        <span className={`status-badge ${historial.estado ? 'status-active' : 'status-inactive'}`}>
                                            {historial.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segunda fila - Fecha */}
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaCalendarAlt className="me-2" />
                                Fecha
                            </h4>
                            <div className="row">
                                <div className="col-12">
                                    <div className="detail-item">
                                        <label>Fecha y Hora:</label>
                                        <span className="detail-value">{formatFecha(historial.fechahora)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tercera fila - Información Médica Principal */}
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaStethoscope className="me-2" />
                                Información Médica Principal
                            </h4>
                            <div className="row">
                                <div className="col-12">
                                    <div className="detail-item-full">
                                        <label><FaStethoscope className="me-1" /> Diagnóstico:</label>
                                        <div className="detail-text-area">
                                            {historial.diagnostico || 'No especificado'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-2">
                                    <div className="detail-item-full">
                                        <label><FaPills className="me-1" /> Tratamientos:</label>
                                        <div className="detail-text-area">
                                            {historial.tratamientos || 'No especificado'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-2">
                                    <div className="detail-item-full">
                                        <label><FaNotesMedical className="me-1" /> Cuadro Médico:</label>
                                        <div className="detail-text-area">
                                            {historial.cuadroMedico || 'No especificado'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cuarta fila - Antecedentes y Observaciones en columnas */}
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="detail-section h-100">
                            <h4 className="detail-section-title">
                                <FaAllergies className="me-2" />
                                Antecedentes y Alergias
                            </h4>
                            <div className="detail-item-full">
                                <label><FaAllergies className="me-1" /> Alergias:</label>
                                <div className="detail-text-area">
                                    {historial.alergias || 'No especificadas'}
                                </div>
                            </div>
                            <div className="detail-item-full mt-2">
                                <label><FaProcedures className="me-1" /> Antecedentes Familiares:</label>
                                <div className="detail-text-area">
                                    {historial.antecedentesFamiliares || 'No especificados'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="detail-section h-100">
                            <h4 className="detail-section-title">
                                <FaNotesMedical className="me-2" />
                                Observaciones y Notas
                            </h4>
                            <div className="detail-item-full">
                                <label>Observaciones:</label>
                                <div className="detail-text-area">
                                    {historial.observaciones || 'No especificadas'}
                                </div>
                            </div>
                            <div className="detail-item-full mt-2">
                                <label>Notas Adicionales:</label>
                                <div className="detail-text-area">
                                    {historial.notas || 'No especificadas'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions mt-4">
                    <button type="button" onClick={onClose} className="btn-management btn-management-secondary">
                        <FaTimes style={{ marginRight: 6 }} /> Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistorialMedicoDetails;