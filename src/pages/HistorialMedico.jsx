import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import HistorialMedicoList from '../components/historialMedico/HistorialMedicoList';
import HistorialMedicoForm from '../components/historialMedico/HistorialMedicoForm';
import HistorialMedicoDetails from '../components/historialMedico/HistorialMedicoDetails';
import historialMedicoService from '../services/historialMedicoService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';
import pacienteService from '../services/pacienteService'

const HistorialMedico = () => {
    const [historiales, setHistoriales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingHistorial, setEditingHistorial] = useState(null);
    const [selectedHistorial, setSelectedHistorial] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredHistoriales = useMemo(() => {
        let result = [...historiales];
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(h =>
                (h.diagnostico && h.diagnostico.toLowerCase().includes(searchLower)) ||
                (h.tratamientos && h.tratamientos.toLowerCase().includes(searchLower)) ||
                (h.observaciones && h.observaciones.toLowerCase().includes(searchLower)) ||
                (h.nombrePaciente && h.nombrePaciente.toLowerCase().includes(searchLower))
            );
        }
        return result;
    }, [historiales, searchTerm]);

    const currentPageHistoriales = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredHistoriales.slice(startIndex, endIndex);
    }, [filteredHistoriales, currentPage, itemsPerPage]);

    const totalItems = filteredHistoriales.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        loadHistoriales();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadHistoriales = async () => {
        setLoading(true);
        setError('');
        try {
            // 1️⃣ Obtener historiales
            const data = await historialMedicoService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            // 2️⃣ Obtener pacientes desde tu servicio Axios
            const pacientesData = await pacienteService.getAll();
            const pacientes = Array.isArray(pacientesData) ? pacientesData : (pacientesData.items || []);


            // 3️⃣ Crear mapa rápido por ID
            const mapaPacientes = {};
            pacientes.forEach(p => {
                mapaPacientes[p.idPaciente] = p;
            });

            // 4️⃣ Mapear historiales agregando nombre completo
            const mapped = rawList.map((h, index) => {
                const resolvedId =
                    h.idHistorialMedico ??
                    h.idhistorialmedico ??
                    h.IdHistorialMedico ??
                    h.id ??
                    h.Id ??
                    null;

                // ➕ Buscar paciente por ID
                const paciente = mapaPacientes[h.idPaciente];
                const nombreCompleto = paciente
                    ? `${paciente.nombre} ${paciente.apellido}`
                    : "Paciente desconocido";

                return {
                    id:
                        resolvedId != null &&
                            typeof resolvedId === "string" &&
                            /^\d+$/.test(resolvedId)
                            ? Number(resolvedId)
                            : resolvedId,

                    _key: resolvedId != null ? `idHistorialMedico-${resolvedId}` : `fallback-${index}`,

                    idPaciente: h.idPaciente ?? h.idpaciente ?? h.IdPaciente ?? null,

                    // ⬅️ AQUÍ VA EL NOMBRE COMPLETO
                    nombrePaciente: nombreCompleto,

                    idCita: h.idCita ?? h.idcita ?? h.IdCita ?? null,
                    notas: h.notas ?? h.Notas ?? '',
                    diagnostico: h.diagnostico ?? h.Diagnostico ?? '',
                    tratamientos: h.tratamientos ?? h.Tratamientos ?? '',
                    cuadroMedico: h.cuadroMedico ?? h.cuadroMedico ?? h.CuadroMedico ?? '',
                    alergias: h.alergias ?? h.Alergias ?? '',
                    antecedentesFamiliares: h.antecedentesFamiliares ?? h.antecedentesFamiliares ?? h.AntecedentesFamiliares ?? '',
                    observaciones: h.observaciones ?? h.Observaciones ?? '',
                    fechahora: h.fechahora ?? h.FechaHora ?? h.fechaHora ?? '',
                    estado: h.estado === 1 || h.estado === true || String(h.estado) === "1"
                };
            });

            setHistoriales(mapped);
        } catch (err) {
            const errorMessage =
                err?.message || "Error al cargar los historiales médicos";
            setError(errorMessage);
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingHistorial(null);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleEdit = (historial) => {
        setEditingHistorial(historial);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleView = (historial) => {
        setSelectedHistorial(historial);
        setShowDetails(true);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de desactivar el historial médico?',
            text: "¡No podrás revertir esta acción! El historial no estará disponible para consultas.",
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
            await historialMedicoService.delete(id);
            await loadHistoriales();
        } catch (err) {
            console.error('Error al eliminar historial:', err);
        }
    };

    const handleFormSubmit = async (historialData) => {
        try {
            if (editingHistorial && editingHistorial.id) {
                await historialMedicoService.update(editingHistorial.id, historialData);
            } else {
                await historialMedicoService.create(historialData);
            }

            setShowForm(false);
            setEditingHistorial(null);
            await loadHistoriales();
        } catch (err) {
            console.error('handleFormSubmit error:', err);
            const apiData = err?.response?.data ?? err;
            const message = apiData?.message || JSON.stringify(apiData) || 'Error al guardar';
            Swal.fire('Error', message, 'error');
        }
    };

    const handleCancel = () => {
        if (editingHistorial?.idPaciente) {
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
                    setEditingHistorial(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingHistorial(null);
        }
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedHistorial(null);
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
                <h1 className="management-title">Gestión de Historiales Médicos</h1>
                {!showForm && !showDetails && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Historial
                    </button>
                )}
            </div>

            {!showForm && !showDetails && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por diagnóstico, tratamiento, observaciones o paciente..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <HistorialMedicoForm
                    historial={editingHistorial}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : showDetails ? (
                <HistorialMedicoDetails
                    historial={selectedHistorial}
                    onClose={handleCloseDetails}
                />
            ) : (
                <>
                    <HistorialMedicoList
                        historiales={currentPageHistoriales}
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

export default HistorialMedico;