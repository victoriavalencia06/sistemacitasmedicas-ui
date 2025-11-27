import React, { useState, useEffect } from 'react';
import {
    FaUserMd,
    FaIdCard,
    FaPhone,
    FaClock,
    FaStethoscope,
    FaCalendarAlt,
    FaTimes,
    FaPlus,
    FaTrash,
    FaEnvelope,
    FaUser
} from 'react-icons/fa';
import doctorEspecializacionService from '../../services/doctorEspecializacionService';
import especializacionService from '../../services/especializacionService';
import Swal from 'sweetalert2';

const DoctorDetails = ({ doctor, onClose }) => {
    const [especializaciones, setEspecializaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctor?.id) {
            loadEspecializaciones();
        } else {
            setEspecializaciones([]);
        }
    }, [doctor]);

    const loadEspecializaciones = async () => {
        if (!doctor?.id) return;
        setLoading(true);
        try {
            console.log('🔄 Cargando asignaciones para doctor', doctor.id);
            const asignadasRaw = await doctorEspecializacionService.getByDoctor(doctor.id);
            const asignadasArr = Array.isArray(asignadasRaw) ? asignadasRaw : [];

            // Obtener todas las especializaciones (una sola llamada)
            const all = await especializacionService.getAll();
            const allRaw = Array.isArray(all) ? all : (all.items || all || []);
            const normAll = allRaw.map(e => ({
                id: e.idEspecializacion ?? e.idespecializacion ?? e.IdEspecializacion ?? e.id ?? e.Id ?? null,
                nombre: e.nombre ?? e.Nombre ?? e.name ?? null
            }));
            const nameMap = new Map(normAll.map(e => [Number(e.id), e.nombre]));

            const asignadas = asignadasArr.map((item, idx) => {
                const mapId = item.idDoctorEspecialidad ?? item.idoctorespecializacion ?? item.id ?? idx;
                const idEsp = item.idEspecializacion ?? item.idespecializacion ?? item.IdEspecializacion ?? null;
                const nombreFromRelation =
                    item.especializacion?.nombre ??
                    item.especializacion?.Nombre ??
                    item.nombre ??
                    item.Nombre ??
                    null;

                const nombre = nombreFromRelation || (idEsp != null ? nameMap.get(Number(idEsp)) : null) || 'Especialización sin nombre';

                return {
                    mapId,
                    idEspecializacion: idEsp != null ? Number(idEsp) : null,
                    nombre
                };
            });

            console.log('➡️ asignadas normalizadas:', asignadas);
            setEspecializaciones(asignadas);
        } catch (err) {
            console.error('❌ Error cargando especializaciones:', err);
            setEspecializaciones([]);
            Swal.fire('Error', 'No se pudieron cargar las especializaciones del doctor', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatHorario = (horario) => {
        if (!horario) return 'No especificado';
        try {
            const date = new Date(horario);
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Formato inválido';
        }
    };

    const handleQuitarEspecializacion = async (especializacionId, nombre) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Quitar especialización?',
            html: `¿Estás seguro de quitar <strong>"${nombre}"</strong> al doctor?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, quitar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });
        if (!isConfirmed) return;

        try {
            await doctorEspecializacionService.quitar(doctor.id, especializacionId);

            await Swal.fire({
                title: '¡Especialización removida!',
                html: `Se removió <strong>"${nombre}"</strong> del doctor correctamente.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            await loadEspecializaciones();
        } catch (err) {
            console.error('Error quitando especialización:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Error al remover especialización',
                text: err.message || 'No se pudo remover la especialización'
            });
        }
    };

    const handleAsignarEspecializacion = async () => {
        try {
            const all = await especializacionService.getAll();
            console.log('📦 Todas las especializaciones disponibles:', all);

            const rawList = Array.isArray(all) ? all : (all.items || all || []);
            const normAll = rawList.map(e => ({
                id: e.idEspecializacion ?? e.idespecializacion ?? e.IdEspecializacion ?? e.id ?? e.Id ?? null,
                nombre: e.nombre ?? e.Nombre ?? e.name ?? 'Especialización sin nombre'
            }));

            console.log('✅ Especializaciones normalizadas:', normAll);

            // Filtrar las ya asignadas
            const assignedIds = new Set(especializaciones.filter(a => a.idEspecializacion != null).map(a => Number(a.idEspecializacion)));
            const available = normAll.filter(x => x.id != null && !assignedIds.has(Number(x.id)));

            console.log('🔄 Especializaciones disponibles para asignar:', available);

            if (available.length === 0) {
                await Swal.fire({
                    title: 'Sin especializaciones disponibles',
                    text: 'No hay más especializaciones para asignar a este doctor.',
                    icon: 'info'
                });
                return;
            }

            const { value: selectedId } = await Swal.fire({
                title: 'Asignar Especialización',
                html: `
                    <div style="text-align: left;">
                        <p>Selecciona una especialización para asignar al doctor:</p>
                        <select id="especializacionSelect" class="swal2-input">
                            <option value="">-- Seleccionar --</option>
                            ${available.map(esp => `<option value="${esp.id}">${esp.nombre}</option>`).join('')}
                        </select>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Asignar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                preConfirm: () => {
                    const select = document.getElementById('especializacionSelect');
                    if (!select.value) {
                        Swal.showValidationMessage('Por favor selecciona una especialización');
                        return false;
                    }
                    return select.value;
                }
            });

            if (selectedId) {
                await doctorEspecializacionService.asignar(doctor.id, Number(selectedId));

                const especializacionAsignada = available.find(esp => esp.id == selectedId);

                await Swal.fire({
                    title: '¡Especialización asignada!',
                    html: `Se asignó <strong>"${especializacionAsignada?.nombre}"</strong> al doctor correctamente.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                await loadEspecializaciones();
            }
        } catch (err) {
            console.error('Error en asignación:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Error al asignar especialización',
                text: err.message || 'No se pudo asignar la especialización'
            });
        }
    };

    if (!doctor) return null;

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <h2 className="management-form-title mb-1">
                            <FaUserMd style={{ marginRight: 8 }} />
                            Detalles del Doctor
                        </h2>
                        <p className="management-form-subtitle mb-0">
                            Información completa del doctor y su usuario
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
                <div className="row">
                    {/* Información del Usuario */}
                    <div className="col-md-6">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaUser className="me-2" />
                                Información de Usuario
                            </h4>

                            <div className="detail-item">
                                <label><FaEnvelope className="me-1" /> Correo:</label>
                                <span className="detail-value">{doctor.correo || 'No especificado'}</span>
                            </div>

                            <div className="detail-item">
                                <label>ID de Usuario:</label>
                                <span className="detail-value">#{doctor.idUsuario || 'No asignado'}</span>
                            </div>

                            <div className="detail-item">
                                <label>Rol:</label>
                                <span className="detail-value">
                                    {doctor.idRol === 1 ? 'Administrador' : 
                                     doctor.idRol === 2 ? 'Doctor' : 
                                     `Rol ${doctor.idRol}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Información Personal del Doctor */}
                    <div className="col-md-6">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaUserMd className="me-2" />
                                Información Personal
                            </h4>

                            <div className="detail-item">
                                <label>Nombre Completo:</label>
                                <span className="detail-value">{doctor.nombre} {doctor.apellido}</span>
                            </div>

                            <div className="detail-item">
                                <label><FaIdCard className="me-1" /> Cédula Profesional:</label>
                                <span className="detail-value">{doctor.cedulaProfesional || 'No especificada'}</span>
                            </div>

                            <div className="detail-item">
                                <label><FaPhone className="me-1" /> Teléfono:</label>
                                <span className="detail-value">{doctor.telefono || 'No especificado'}</span>
                            </div>

                            <div className="detail-item">
                                <label>Estado:</label>
                                <span className={`status-badge ${doctor.estado ? 'status-active' : 'status-inactive'}`}>
                                    {doctor.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    {/* Información Profesional */}
                    <div className="col-md-6">
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <FaStethoscope className="me-2" />
                                Información Profesional
                            </h4>

                            <div className="detail-item">
                                <label><FaClock className="me-1" /> Horario Registro:</label>
                                <span className="detail-value">{formatHorario(doctor.horario)}</span>
                            </div>

                            <div className="detail-item">
                                <label>ID del Doctor:</label>
                                <span className="detail-value">#{doctor.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Especializaciones */}
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="detail-section">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="detail-section-title mb-0">
                                    <FaStethoscope className="me-2" /> Especializaciones
                                </h4>

                                <button
                                    className="btn-management btn-sm"
                                    onClick={handleAsignarEspecializacion}
                                >
                                    <FaPlus style={{ marginRight: 6 }} /> Asignar Especialización
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando especializaciones...</span>
                                    </div>
                                </div>
                            ) : especializaciones.length > 0 ? (
                                <div className="specializations-grid">
                                    {especializaciones.map((esp, index) => (
                                        <div key={esp.mapId ?? esp.idEspecializacion ?? index} className="specialization-card">
                                            <div className="specialization-content">
                                                <h6 className="specialization-name">{esp.nombre}</h6>
                                            </div>
                                            <button
                                                className="btn-remove-especializacion"
                                                onClick={() => handleQuitarEspecializacion(esp.idEspecializacion, esp.nombre)}
                                                title={`Remover ${esp.nombre}`}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No tiene especializaciones asignadas</p>
                                </div>
                            )}
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

export default DoctorDetails;