import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaUserShield } from 'react-icons/fa'; // ✅ CAMBIADO FaShield por FaUserShield
import RolList from '../components/roles/RolList';
import RolForm from '../components/roles/RolForm';
import rolService from '../services/rolService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRol, setEditingRol] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredRoles = useMemo(() => {
        let result = [...roles];
        if (searchTerm.trim() !== '') {
            result = result.filter(r =>
                r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [roles, searchTerm]);

    const currentPageRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRoles.slice(startIndex, endIndex);
    }, [filteredRoles, currentPage, itemsPerPage]);

    const totalItems = filteredRoles.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadRoles = async () => {
        setLoading(true);
        setError('');
        try {
            // Usar el nuevo método que incluye permisos
            const data = await rolService.getAllWithPermissions();
            const mapped = data.map((rol) => ({
                id: rol.idRol,
                _key: `idRol-${rol.idRol}`,
                nombre: rol.nombre,
                estado: rol.estado === 1,
                permisos: rol.permisos || []
            }));

            setRoles(mapped);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar los roles';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
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
            title: '¿Estás seguro de desactivar el rol?',
            text: "Los usuarios con este rol perderán acceso al sistema",
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
            await rolService.deactivate(id);
            await loadRoles();
        } catch (err) {
            // El error ya se maneja en el servicio
        }
    };

    const handleReactivate = async (id) => {
        try {
            await rolService.reactivate(id);
            await loadRoles();
        } catch (err) {
            // El error ya se maneja en el servicio
        }
    };

    const handleFormSubmit = async (rolData) => {
        try {
            if (editingRol && editingRol.id) {
                await rolService.updateWithPermissions(editingRol.id, rolData);
            } else {
                await rolService.createWithPermissions(rolData);
            }

            setShowForm(false);
            setEditingRol(null);
            await loadRoles();
        } catch (err) {
            // El error ya se maneja en el servicio
        }
    };

    const handleCancel = () => {
        if (editingRol?.nombre) {
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
                    setEditingRol(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingRol(null);
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
                <div className="header-title-section">
                    <FaUserShield className="header-icon" /> {/* ✅ CAMBIADO */}
                    <h1 className="management-title">Gestión de Roles y Permisos</h1>
                </div>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Rol
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
                <RolForm 
                    rol={editingRol} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancel} 
                />
            ) : (
                <>
                    <RolList
                        roles={currentPageRoles}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReactivate={handleReactivate}
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

export default Roles;