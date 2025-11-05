import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import RolList from '../components/roles/RolList';
import RolForm from '../components/roles/RolForm';
import rolService from '../services/rolService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRol, setEditingRol] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos'); // todos | activos | inactivos

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        loadRoles();
    }, [currentPage]);

    useEffect(() => {
        filterRoles();
    }, [searchTerm, filterEstado, roles]);

    const loadRoles = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await rolService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            const mapped = rawList.map((r, index) => {
                const resolvedId = r.idRol ?? r.idrol ?? r.IdRol ?? r.id ?? r.Id ?? null;
                return {
                    id: resolvedId != null && typeof resolvedId === 'string' && /^\d+$/.test(resolvedId)
                        ? Number(resolvedId)
                        : resolvedId,
                    _key: resolvedId != null ? `idRol-${resolvedId}` : `fallback-${index}`,
                    nombre: r.nombre ?? r.Nombre ?? r.name ?? '',
                    estado: r.estado === 1 || r.estado === true || String(r.estado) === '1'
                };
            });

            setRoles(mapped);
            setTotalItems(mapped.length);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar los roles';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Filtrado por búsqueda y estado
    const filterRoles = () => {
        let result = [...roles];

        if (searchTerm.trim() !== '') {
            result = result.filter(r =>
                r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterEstado === 'activos') {
            result = result.filter(r => r.estado === true);
        } else if (filterEstado === 'inactivos') {
            result = result.filter(r => r.estado === false);
        }

        setFilteredRoles(result);
        setTotalItems(result.length);
        setCurrentPage(1); // reset al cambiar filtro
    };

    const handleCreate = () => {
        setEditingRol(null);
        setShowForm(true);
    };

    const handleEdit = (rol) => {
        setEditingRol(rol);
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
            await rolService.delete(id);
            await loadRoles();
            if (roles.length === 1 && currentPage > 1) setCurrentPage(1);
        } catch (err) { }
    };

    const handleFormSubmit = async (rolData) => {
        try {
            const payload = {
                Nombre: rolData.nombre ?? '',
                Estado: rolData.estado ? 1 : 0
            };

            if (editingRol && editingRol.id) {
                await rolService.update(editingRol.id, payload);
            } else {
                await rolService.create(payload);
            }

            setShowForm(false);
            setEditingRol(null);
            await loadRoles();
        } catch (err) { }
    };

    const handleCancel = () => {
        if (editingRol?.nombre) {
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
                    setEditingRol(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingRol(null);
        }
    };

    const getCurrentPageRoles = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRoles.slice(startIndex, endIndex);
    };

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">Gestión de Roles</h1>
                <button onClick={handleCreate} className="btn-management">
                    <FaPlus style={{ marginRight: 6 }} /> Nuevo Rol
                </button>
            </div>

            {/* 🔍 Barra de búsqueda y filtro */}
            <div className="management-filters">
                <div className="search-input">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <RolForm rol={editingRol} onSubmit={handleFormSubmit} onCancel={handleCancel} />
            ) : (
                <>
                    <RolList roles={getCurrentPageRoles()} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
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

export default Roles;
