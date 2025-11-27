import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import CitaList from '../components/citas/CitaList';
import CitaForm from '../components/citas/CitaForm';
import citaService from '../services/citaService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCita, setEditingCita] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todas');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        loadCitas();
        loadDatosFormulario();
    }, []);

    const loadDatosFormulario = async () => {
        try {
            const [usuariosData, doctoresData, pacientesData] = await Promise.all([
                citaService.getUsuariosActivos(),
                citaService.getDoctoresActivos(),
                citaService.getPacientesActivos()
            ]);

            setUsuarios(usuariosData);
            setDoctores(doctoresData);
            setPacientes(pacientesData);
        } catch (error) {
            console.error('❌ Error al cargar datos del formulario:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del formulario', 'error');
        }
    };

    const filteredCitas = useMemo(() => {
        let result = [...citas];
        if (searchTerm.trim() !== '') {
            result = result.filter(c =>
                String(c.pacienteNombre).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(c.doctorNombre).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterEstado !== 'todas') {
            result = result.filter(c => c.estadoDisplay.toLowerCase() === filterEstado.toLowerCase());
        }
        return result;
    }, [citas, searchTerm, filterEstado]);

    const currentPageCitas = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCitas.slice(startIndex, endIndex);
    }, [filteredCitas, currentPage, itemsPerPage]);

    const totalItems = filteredCitas.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadCitas = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await citaService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            const mapped = rawList.map((c) => ({
                id: c.idCita || c.IdCita,
                idCita: c.idCita || c.IdCita,
                pacienteNombre: c.paciente || c.Paciente || 'Sin paciente',
                doctorNombre: c.doctor || c.Doctor || 'Sin doctor',
                usuarioNombre: c.usuario || c.Usuario || '',
                idUsuario: c.idUsuario || c.IdUsuario,
                idPaciente: c.idPaciente || c.IdPaciente,
                idDoctor: c.idDoctor || c.IdDoctor,
                fechaHora: c.fechaHora || c.FechaHora || '',
                fechaHoraOriginal: c.fechaHora || c.FechaHora || '',
                estado: (c.estado !== undefined ? c.estado : c.Estado),
                estadoDisplay: (c.estado !== undefined ? (c.estado ? 'Activa' : 'Cancelada') : (c.Estado ? 'Activa' : 'Cancelada'))
            }));

            // ✅ Ordenar por idCita ascendente
            mapped.sort((a, b) => a.idCita - b.idCita);

            setCitas(mapped);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar las citas';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCita(null);
        setShowForm(true);
    };

    const handleEdit = async (cita) => {
        try {
            const fechaParaInput = citaService.isoToDatetimeLocalInput
                ? citaService.isoToDatetimeLocalInput(cita.fechaHoraOriginal || cita.fechaHora)
                : (cita.fechaHoraOriginal ? new Date(cita.fechaHoraOriginal).toISOString().slice(0,16) : (cita.fechaHora ? new Date(cita.fechaHora).toISOString().slice(0,16) : ''));

            const citaParaEditar = {
                id: cita.idCita,
                idCita: cita.idCita,
                idUsuario: (cita.idUsuario || cita.IdUsuario || '')?.toString() || '',
                idPaciente: (cita.idPaciente || cita.IdPaciente || '')?.toString() || '',
                idDoctor: (cita.idDoctor || cita.IdDoctor || '')?.toString() || '',
                fechaHora: fechaParaInput,
                fechaHoraOriginal: cita.fechaHoraOriginal || cita.fechaHora,
                estado: cita.estado
            };

            setEditingCita(citaParaEditar);
            setShowForm(true);

        } catch (err) {
            console.error('❌ Error al preparar cita para editar:', err);
            const citaParaEditar = {
                id: cita.idCita,
                idCita: cita.idCita,
                idUsuario: '',
                idPaciente: '',
                idDoctor: '',
                fechaHora: cita.fechaHoraOriginal ? new Date(cita.fechaHoraOriginal).toISOString().slice(0, 16) : (cita.fechaHora ? new Date(cita.fechaHora).toISOString().slice(0, 16) : ''),
                fechaHoraOriginal: cita.fechaHoraOriginal || cita.fechaHora,
                estado: cita.estado
            };

            setEditingCita(citaParaEditar);
            setShowForm(true);

            Swal.fire({
                icon: 'warning',
                title: 'Información incompleta',
                text: 'Algunos campos no pudieron cargarse automáticamente. Por favor, seleccione manualmente.',
                timer: 3000
            });
        }
    };

    const handleDelete = async (id) => {
        const citaAEliminar = citas.find(c => c.idCita === id);

        const result = await Swal.fire({
            title: '¿Estás seguro de eliminar esta cita?',
            html: citaAEliminar ?
                `Vas a eliminar la cita de <strong>${citaAEliminar.pacienteNombre}</strong> con el doctor <strong>${citaAEliminar.doctorNombre}</strong>` :
                'Vas a eliminar esta cita',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await citaService.delete(id);
            await loadCitas();

            Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La cita fue eliminada correctamente',
                timer: 1200,
                showConfirmButton: false
            });
        } catch (err) {
            console.error('❌ Error al eliminar cita:', err);
            Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
        }
    };

    const handleFormSubmit = async (citaData) => {
        try {
            if (editingCita && editingCita.idCita) {
                await citaService.update(editingCita.idCita, citaData);
            } else {
                await citaService.create(citaData);
            }

            setShowForm(false);
            setEditingCita(null);
            await loadCitas();

        } catch (err) {
            console.error('❌ Error en handleFormSubmit:', err);
        }
    };

    const handleCancel = () => {
        if (editingCita?.idCita) {
            Swal.fire({
                title: '¿Estás seguro?',
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
                    setEditingCita(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingCita(null);
        }
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
                <h1 className="management-title">Gestión de Citas</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nueva Cita
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de paciente o doctor..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                    >
                        <option value="todas">Todas</option>
                        <option value="activa">Activas</option>
                        <option value="cancelada">Canceladas</option>
                    </select>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <CitaForm
                    cita={editingCita}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    usuarios={usuarios}
                    doctores={doctores}
                    pacientes={pacientes}
                />
            ) : (
                <>
                    <CitaList
                        citas={currentPageCitas}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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

export default Citas;