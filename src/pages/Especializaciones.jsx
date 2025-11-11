import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import EspecializacionList from '../components/especializaciones/EspecializacionList';
import EspecializacionForm from '../components/especializaciones/EspecializacionForm';
import especializacionService from '../services/especializacionService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Especializaciones = () => {
    const [especializaciones, setEspecializaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEspecializacion, setEditingEspecializacion] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredEspecializaciones = useMemo(() => {
        let result = [...especializaciones];
        if (searchTerm.trim() !== '') {
            result = result.filter(e =>
                e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [especializaciones, searchTerm]);

    const currentPageEspecializaciones = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEspecializaciones.slice(startIndex, endIndex);
    }, [filteredEspecializaciones, currentPage, itemsPerPage]);

    const totalItems = filteredEspecializaciones.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        loadEspecializaciones();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadEspecializaciones = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await especializacionService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            const mapped = rawList.map((e, index) => {
                const resolvedId = e.idEspecializacion ?? e.idespecializacion ?? e.IdEspecializacion ?? e.id ?? e.Id ?? null;
                return {
                    id: resolvedId != null && typeof resolvedId === 'string' && /^\d+$/.test(resolvedId)
                        ? Number(resolvedId)
                        : resolvedId,
                    _key: resolvedId != null ? `idEspecializacion-${resolvedId}` : `fallback-${index}`,
                    nombre: e.nombre ?? e.Nombre ?? e.name ?? '',
                    descripcion: e.descripcion ?? e.Descripcion ?? e.description ?? '',
                    estado: e.estado === 1 || e.estado === true || String(e.estado) === '1'
                };
            });

            setEspecializaciones(mapped);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar las especializaciones';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingEspecializacion(null);
        setShowForm(true);
    };

    const handleEdit = (especializacion) => {
        setEditingEspecializacion(especializacion);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de desactivar el registro?',
            text: "¡No podrás revertir esta acción!",
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
            await especializacionService.delete(id);
            await loadEspecializaciones();
        } catch (err) { }
    };

    // Reemplaza la función handleFormSubmit en Especializaciones.jsx con esto:
    const handleFormSubmit = async (especializacionData) => {
        try {
            // Normalizamos el id desde el objeto de edición
            const editingId =
                editingEspecializacion?.id ??
                editingEspecializacion?.IdEspecializacion ??
                editingEspecializacion?.idEspecializacion ??
                null;

            if (editingId == null) {
                // Si no hay id, estamos en modo "create" — construimos payload para create
                const createPayload = {
                    nombre: especializacionData.nombre ?? '',
                    descripcion: especializacionData.descripcion ?? '',
                    estado: especializacionData.estado ? 1 : 0
                };

                console.log('CREATE payload ->', createPayload);
                await especializacionService.create(createPayload);
            } else {
                // Edit mode: validar y enviar id en el body tal como espera Swagger
                const numericId = Number(editingId);
                if (Number.isNaN(numericId)) {
                    Swal.fire('Error', 'El ID de la especialización no es válido.', 'error');
                    console.error('editingId no numérico:', editingId);
                    return;
                }

                const payload = {
                    idEspecializacion: numericId,                   // <- obligatorio para que coincida con la URL
                    nombre: especializacionData.nombre?.trim() ?? '',
                    descripcion: especializacionData.descripcion?.trim() ?? '',
                    estado: especializacionData.estado ? 1 : 0
                };

                console.log(`PUT /especializacion/update/${numericId} payload ->`, payload);

                await especializacionService.update(numericId, payload);
            }

            // cerrar form y recargar lista
            setShowForm(false);
            setEditingEspecializacion(null);
            await loadEspecializaciones();
        } catch (err) {
            console.error('handleFormSubmit error:', err);
            const apiData = err?.response?.data ?? err;
            // extraer mensajes legibles si vienen en errors
            const serverMessage = apiData?.message || apiData?.errors || JSON.stringify(apiData);
            Swal.fire('Error', serverMessage, 'error');
        }
    };


    const handleCancel = () => {
        if (editingEspecializacion?.nombre) {
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
                    setEditingEspecializacion(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingEspecializacion(null);
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
                <h1 className="management-title">Gestión de Especializaciones</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nueva Especialización
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <EspecializacionForm
                    especializacion={editingEspecializacion}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <EspecializacionList
                        especializaciones={currentPageEspecializaciones}
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

export default Especializaciones;