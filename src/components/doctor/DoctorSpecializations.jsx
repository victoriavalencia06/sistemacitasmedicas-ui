import React, { useEffect, useState } from 'react';
import doctorEspecializacionService from '../../services/doctorEspecializacionService';
import especializacionService from '../../services/especializacionService';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Props:
 * - doctorId (number) REQUIRED
 * - readOnly (bool) optional -> si true no muestra controles de asignar/quitar
 * - onUpdate (function) optional -> callback cuando se actualizan las especializaciones
 */
const DoctorSpecializations = ({ doctorId, readOnly = false, onUpdate }) => {
    const [assigned, setAssigned] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (doctorId) {
            loadAll();
        } else {
            setAssigned([]);
            setAvailable([]);
            setSelectedId('');
        }
    }, [doctorId]);

    const loadAll = async () => {
        if (!doctorId) return;

        setLoading(true);
        setError('');
        try {
            // Obtener especializaciones asignadas
            const asignadas = await doctorEspecializacionService.getByDoctor(doctorId);
            console.log('🔄 Especializaciones asignadas recibidas:', asignadas);

            // Normalizar datos asignados
            const normAssigned = Array.isArray(asignadas) ? asignadas.map((a, index) => {
                // Debug para ver la estructura
                if (index === 0) {
                    console.log('🔍 Estructura del primer elemento:', a);
                    console.log('🔍 Keys disponibles:', Object.keys(a));
                }

                // Buscar nombre en diferentes ubicaciones posibles
                let nombre = '';
                if (a.especializacion?.nombre) {
                    nombre = a.especializacion.nombre;
                } else if (a.especializacion?.Nombre) {
                    nombre = a.especializacion.Nombre;
                } else if (a.nombre) {
                    nombre = a.nombre;
                } else if (a.Nombre) {
                    nombre = a.Nombre;
                } else if (a.Especializacion?.nombre) {
                    nombre = a.Especializacion.nombre;
                } else if (a.Especializacion?.Nombre) {
                    nombre = a.Especializacion.Nombre;
                }

                return {
                    idMap: a.idDoctorEspecialidad ?? a.idoctorespecializacion ?? a.id ?? `temp-${index}`,
                    idEspecializacion: a.idEspecializacion ?? a.idespecializacion ?? a.idEspecialidad ?? (a.especializacion?.idEspecializacion ?? null),
                    nombre: nombre || `Especialización #${a.idEspecializacion || index}`
                };
            }) : [];

            setAssigned(normAssigned);

            // Obtener todas las especializaciones disponibles
            const all = await especializacionService.getAll();
            const rawList = Array.isArray(all) ? all : (all.items || all || []);
            console.log('📦 Todas las especializaciones:', rawList);

            const normAll = rawList.map(e => ({
                id: e.idEspecializacion ?? e.idespecializacion ?? e.IdEspecializacion ?? e.id ?? e.Id ?? null,
                nombre: e.nombre ?? e.Nombre ?? e.name ?? 'Especialización sin nombre'
            }));

            // Filtrar las ya asignadas
            const assignedIds = new Set(normAssigned.map(a => Number(a.idEspecializacion)).filter(id => !isNaN(id)));
            const avail = normAll.filter(x => x.id != null && !assignedIds.has(Number(x.id)));

            setAvailable(avail);
            setSelectedId(avail.length > 0 ? String(avail[0].id) : '');

            console.log('✅ Asignadas:', normAssigned);
            console.log('✅ Disponibles:', avail);

        } catch (err) {
            console.error('❌ Error cargando especializaciones:', err);
            setError('No se pudieron cargar las especializaciones');
            setAssigned([]);
            setAvailable([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAsignar = async () => {
        if (!selectedId) {
            await Swal.fire('Atención', 'Selecciona una especialización para asignar', 'info');
            return;
        }

        try {
            await doctorEspecializacionService.asignar(doctorId, Number(selectedId));

            // Mostrar feedback de éxito
            const especializacionAsignada = available.find(esp => esp.id == selectedId);
            await Swal.fire({
                title: '¡Asignada!',
                html: `Especialización <strong>"${especializacionAsignada?.nombre}"</strong> asignada correctamente`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            await loadAll();

            // Notificar al componente padre si es necesario
            if (onUpdate) {
                onUpdate();
            }

        } catch (err) {
            console.error('Error asignando especialización:', err);
            // El error ya se muestra en el service
        }
    };

    const handleQuitar = async (especializacionId, nombre) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Quitar especialización?',
            html: `¿Estás seguro de quitar <strong>"${nombre}"</strong> del doctor?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, quitar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (!isConfirmed) return;

        try {
            await doctorEspecializacionService.quitar(doctorId, especializacionId);

            await Swal.fire({
                title: '¡Removida!',
                html: `Especialización <strong>"${nombre}"</strong> removida correctamente`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            await loadAll();

            // Notificar al componente padre si es necesario
            if (onUpdate) {
                onUpdate();
            }

        } catch (err) {
            console.error('Error quitando especialización:', err);
        }
    };

    if (!doctorId) {
        return (
            <div className="alert alert-warning">
                <FaExclamationTriangle /> ID de doctor no disponible
            </div>
        );
    }

    return (
        <div className="doctor-specializations">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Especializaciones</h5>
                {!readOnly && assigned.length > 0 && (
                    <small className="text-muted">
                        {assigned.length} especialización(es) asignada(s)
                    </small>
                )}
            </div>

            {error && (
                <div className="alert alert-warning d-flex align-items-center">
                    <FaExclamationTriangle className="me-2" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando especializaciones...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Lista de especializaciones asignadas */}
                    <div className="specializations-grid mb-3">
                        {assigned.length > 0 ? (
                            assigned.map((a) => (
                                <div key={a.idMap} className="specialization-card">
                                    <div className="specialization-content">
                                        <span className="specialization-name">{a.nombre}</span>
                                    </div>
                                    {!readOnly && (
                                        <button
                                            className="btn-remove-especializacion"
                                            onClick={() => handleQuitar(a.idEspecializacion, a.nombre)}
                                            title={`Quitar ${a.nombre}`}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-3">
                                <p className="text-muted mb-2">No tiene especializaciones asignadas</p>
                            </div>
                        )}
                    </div>

                    {/* Controles para asignar (solo si no es readOnly) */}
                    {!readOnly && (
                        <div className="assign-section border-top pt-3">
                            <label className="form-label mb-2">Asignar nueva especialización:</label>
                            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
                                <select
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    className="form-control"
                                    style={{ maxWidth: '320px' }}
                                    disabled={available.length === 0}
                                >
                                    {available.length === 0 ? (
                                        <option value="">-- No hay especializaciones disponibles --</option>
                                    ) : (
                                        <>
                                            <option value="">-- Seleccionar especialización --</option>
                                            {available.map(esp => (
                                                <option key={esp.id} value={esp.id}>
                                                    {esp.nombre}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>

                                <button
                                    className="btn-management btn-sm"
                                    onClick={handleAsignar}
                                    disabled={!selectedId || available.length === 0}
                                    style={{ minWidth: '120px' }}
                                >
                                    <FaPlus style={{ marginRight: 6 }} />
                                    {available.length === 0 ? 'Sin opciones' : 'Asignar'}
                                </button>
                            </div>

                            {available.length === 0 && (
                                <small className="text-muted mt-1">
                                    Todas las especializaciones están asignadas a este doctor
                                </small>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DoctorSpecializations;