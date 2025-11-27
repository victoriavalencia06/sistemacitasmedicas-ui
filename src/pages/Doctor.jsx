import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaSync } from 'react-icons/fa';
import DoctorList from '../components/doctor/DoctorList';
import DoctorForm from '../components/doctor/DoctorForm';
import DoctorDetails from '../components/doctor/DoctorDetails';
import doctorService from '../services/doctorService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Doctor = () => {
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'inactive'

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Filtrar doctores según el modo de vista y búsqueda
    const filteredDoctores = useMemo(() => {
        let result = [...doctores];
        
        // Filtrar por estado
        if (viewMode === 'active') {
            result = result.filter(d => d.estado);
        } else if (viewMode === 'inactive') {
            result = result.filter(d => !d.estado);
        }

        // Filtrar por búsqueda
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(d =>
                d.nombre?.toLowerCase().includes(searchLower) ||
                d.apellido?.toLowerCase().includes(searchLower) ||
                d.telefono?.toLowerCase().includes(searchLower) ||
                d.correo?.toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [doctores, searchTerm, viewMode]);

    const currentPageDoctores = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDoctores.slice(startIndex, endIndex);
    }, [filteredDoctores, currentPage, itemsPerPage]);

    const totalItems = filteredDoctores.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        loadDoctores();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadDoctores = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await doctorService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            const mapped = rawList.map((d, index) => {
                const resolvedId = d.idDoctor ?? d.iddoctor ?? d.IdDoctor ?? d.id ?? d.Id ?? null;
                return {
                    id: resolvedId != null && typeof resolvedId === 'string' && /^\d+$/.test(resolvedId)
                        ? Number(resolvedId)
                        : resolvedId,
                    _key: resolvedId != null ? `idDoctor-${resolvedId}` : `fallback-${index}`,
                    nombre: d.nombre ?? d.Nombre ?? '',
                    apellido: d.apellido ?? d.Apellido ?? '',
                    cedulaProfesional: d.cedulaProfesional ?? d.CedulaProfesional ?? '',
                    telefono: d.telefono ?? d.Telefono ?? '',
                    horario: d.horario ?? d.Horario ?? '',
                    estado: d.estado === 1 || d.estado === true || String(d.estado) === '1',
                    idUsuario: d.idUsuario ?? d.idusuario,
                    correo: d.correo ?? d.Correo ?? '',
                    idRol: d.idRol ?? d.idrol ?? 2,
                    doctorEspecializaciones: d.doctorEspecializaciones ?? d.especializaciones ?? [],
                    fechaRegistro: d.fechaRegistro,
                    fechaActualizacion: d.fechaActualizacion,
                    totalCitas: d.totalCitas
                };
            });

            setDoctores(mapped);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar los doctores';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingDoctor(null);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleView = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDetails(true);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de desactivar el doctor?',
            text: "¡No podrás revertir esta acción! El doctor no podrá ser asignado a nuevas citas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await doctorService.desactivar(id);
            await loadDoctores();
        } catch (err) {
            // Error ya manejado en el servicio
        }
    };

    const handleActivate = async (id) => {
        const result = await Swal.fire({
            title: '¿Activar doctor?',
            text: "El doctor podrá ser asignado a nuevas citas.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await doctorService.activar(id);
            await loadDoctores();
        } catch (err) {
            // Error ya manejado en el servicio
        }
    };

const handleFormSubmit = async (doctorData) => {
    try {
        // Normalizar datos para el nuevo endpoint
        const horarioIso = doctorData.horario && doctorData.horario !== ''
            ? new Date(doctorData.horario).toISOString()
            : new Date().toISOString();

        const telefonoDigits = (doctorData.telefono ?? '').replace(/\D/g, '');

        // Construir payload para doctor completo - SIN idRol
        const payload = {
            // Datos del usuario
            correo: doctorData.correo ?? '',
            password: doctorData.password ?? '',
            
            // Datos del doctor
            nombre: doctorData.nombre ?? '',
            apellido: doctorData.apellido ?? '',
            cedulaProfesional: doctorData.cedulaProfesional ?? '',
            telefono: telefonoDigits,
            horario: horarioIso
        };

        // Para actualización, incluir IDs
        if (editingDoctor && editingDoctor.id) {
            payload.idDoctor = editingDoctor.id;
            payload.idUsuario = editingDoctor.idUsuario;
            
            // Solo enviar password si se proporcionó uno nuevo
            if (!doctorData.password) {
                delete payload.password;
            }
        }

        console.log('📥 Payload FINAL para backend:', payload);

        if (editingDoctor && editingDoctor.id) {
            await doctorService.update(editingDoctor.id, payload);
        } else {
            await doctorService.create(payload);
        }

        setShowForm(false);
        setEditingDoctor(null);
        await loadDoctores();
    } catch (err) {
        console.error('handleFormSubmit error:', err);
        // Error ya manejado en el servicio
    }
};

    const handleCancel = () => {
        if (editingDoctor?.nombre || (editingDoctor === null && showForm)) {
            Swal.fire({
                title: '¿Estás seguro de salir?',
                text: 'Los cambios no guardados se perderán',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowForm(false);
                    setEditingDoctor(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingDoctor(null);
        }
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedDoctor(null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setCurrentPage(1);
    };

    const activeCount = doctores.filter(d => d.estado).length;
    const inactiveCount = doctores.filter(d => !d.estado).length;

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">Gestión de Doctores</h1>
                <div className="management-actions">
                    <button onClick={loadDoctores} className="btn-management btn-management-secondary">
                        <FaSync style={{ marginRight: 6 }} /> Actualizar
                    </button>
                    {!showForm && !showDetails && (
                        <button onClick={handleCreate} className="btn-management">
                            <FaPlus style={{ marginRight: 6 }} /> Nuevo Doctor
                        </button>
                    )}
                </div>
            </div>

            {!showForm && !showDetails && (
                <>
                    <div className="management-filters">
                        <div className="search-input">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido, teléfono o correo..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        
                        <div className="view-mode-buttons">
                            <button 
                                className={`btn-mode ${viewMode === 'all' ? 'active' : ''}`}
                                onClick={() => handleViewModeChange('all')}
                            >
                                Todos ({doctores.length})
                            </button>
                            <button 
                                className={`btn-mode ${viewMode === 'active' ? 'active' : ''}`}
                                onClick={() => handleViewModeChange('active')}
                            >
                                Activos ({activeCount})
                            </button>
                            <button 
                                className={`btn-mode ${viewMode === 'inactive' ? 'active' : ''}`}
                                onClick={() => handleViewModeChange('inactive')}
                            >
                                Inactivos ({inactiveCount})
                            </button>
                        </div>
                    </div>

                    <AlertMessage type="error" message={error} />

                    <DoctorList
                        doctores={currentPageDoctores}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onActivate={handleActivate}
                        onView={handleView}
                    />
                    
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {showForm && (
                <DoctorForm
                    doctor={editingDoctor}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}

            {showDetails && (
                <DoctorDetails
                    doctor={selectedDoctor}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default Doctor;