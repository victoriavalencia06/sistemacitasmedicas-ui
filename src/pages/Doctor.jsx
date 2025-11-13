import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
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

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredDoctores = useMemo(() => {
        let result = [...doctores];
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(d =>
                d.nombre.toLowerCase().includes(searchLower) ||
                d.apellido.toLowerCase().includes(searchLower) ||
                d.cedulaProfesional.toLowerCase().includes(searchLower) ||
                d.telefono.toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [doctores, searchTerm]);

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
            await doctorService.delete(id);
            await loadDoctores();
        } catch (err) { }
    };

    const handleFormSubmit = async (doctorData) => {
        try {
            // doctorData viene desde DoctorForm y debe contener:
            // { nombre, apellido, cedulaProfesional, telefono, horario (ISO o null), estado (boolean) }

            // Normalizar: asegurar horario ISO válido o null (backend requiere DateTime)
            const horarioIso = doctorData.horario && doctorData.horario !== ''
                ? new Date(doctorData.horario).toISOString()
                : new Date().toISOString(); // si quieres forzar ahora porque el modelo exige Horario

            // Asegurar telefono: quitar no dígitos y mantener 8 caracteres
            const telefonoDigits = (doctorData.telefono ?? '').replace(/\D/g, '');
            // opcional: si telefonoDigits.length !== 8, podrías mostrar error al usuario antes de enviar

            // Construir payload en camelCase (el service espera estos nombres)
            const payload = {
                // Si el backend necesita idDoctor en el body al actualizar, lo añadimos más abajo
                idUsuario: doctorData.idUsuario ?? doctorData.idusuario ?? (editingDoctor?.idUsuario ?? 0), // asegúrate de pasar currentUserId si corresponde
                nombre: doctorData.nombre ?? '',
                apellido: doctorData.apellido ?? '',
                cedulaProfesional: doctorData.cedulaProfesional ?? '',
                telefono: telefonoDigits,
                horario: horarioIso,
                estado: doctorData.estado ? 1 : 0,
                DoctorEspecializaciones: doctorData.DoctorEspecializaciones ?? [] // si gestionas relaciones aquí
            };

            console.log('📥 payload preparado (handleFormSubmit):', payload, 'editingDoctorId:', editingDoctor?.id);

            if (editingDoctor && editingDoctor.id) {
                // incluye idDoctor en el body por si el backend lo espera
                await doctorService.update(editingDoctor.id, { ...payload, idDoctor: editingDoctor.id });
            } else {
                // crear -> asegúrate enviar idUsuario válido (obtenlo del contexto/auth si aplica)
                await doctorService.create(payload);
            }

            setShowForm(false);
            setEditingDoctor(null);
            await loadDoctores();
        } catch (err) {
            console.error('handleFormSubmit error:', err);
            const apiData = err?.response?.data ?? err;
            const message = apiData?.message || JSON.stringify(apiData) || 'Error al guardar';
            Swal.fire('Error', message, 'error');
        }
    };


    const handleCancel = () => {
        if (editingDoctor?.nombre) {
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

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">Gestión de Doctores</h1>
                {!showForm && !showDetails && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Doctor
                    </button>
                )}
            </div>

            {!showForm && !showDetails && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido, cédula o teléfono..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <DoctorForm
                    doctor={editingDoctor}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : showDetails ? (
                <DoctorDetails
                    doctor={selectedDoctor}
                    onClose={handleCloseDetails}
                />
            ) : (
                <>
                    <DoctorList
                        doctores={currentPageDoctores}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
        </div>
    );
};

export default Doctor;