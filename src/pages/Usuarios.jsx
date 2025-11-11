import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import UsuarioList from '../components/usuarios/UsuarioList';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import usuarioService from '../services/usuarioService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Usuarios = () => {
    const [usuariosCache, setUsuariosCache] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const initializeData = async () => {
            const cacheGuardado = localStorage.getItem('usuariosCache');
            if (cacheGuardado) {
                setUsuariosCache(JSON.parse(cacheGuardado));
            }
            
            await loadUsuarios();
        };
        
        initializeData();
    }, []);

    useEffect(() => {
        if (usuariosCache.length > 0) {
            localStorage.setItem('usuariosCache', JSON.stringify(usuariosCache));
        }
    }, [usuariosCache]);

    const usuariosParaMostrar = useMemo(() => {
        const filtered = usuariosCache.filter(usuario => 
            usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Ordenar por ID ASCENDENTE (usuarios más antiguos primero)
        return filtered.sort((a, b) => a.id - b.id);
    }, [usuariosCache, searchTerm]);

    const currentPageUsuarios = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return usuariosParaMostrar.slice(startIndex, endIndex);
    }, [usuariosParaMostrar, currentPage, itemsPerPage]);

    const totalItems = usuariosParaMostrar.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadUsuarios = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await usuarioService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            // SOLO PROCESAR USUARIOS ACTIVOS 
            const usuariosActivos = rawList.map((u, index) => {
                const resolvedId = u.idUsuario ?? u.idusuario ?? u.IdUsuario ?? u.id ?? u.Id ?? null;
                return {
                    id: resolvedId,
                    _key: `user-${resolvedId}`,
                    idRol: u.idRol ?? u.idrol ?? u.IdRol ?? 0,
                    nombre: u.nombre ?? u.Nombre ?? '',
                    correo: u.correo ?? u.Correo ?? u.email ?? '',
                    estado: true // Todos los que vienen del backend son activos
                };
            });

            // REEMPLAZAR COMPLETAMENTE EL CACHE CON LOS USUARIOS ACTIVOS
            setUsuariosCache(usuariosActivos);

        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar los usuarios';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingUsuario(null);
        setShowForm(true);
    };

    const handleEdit = (usuario) => {
        setEditingUsuario(usuario);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const usuarioADesactivar = usuariosCache.find(u => u.id === id);
        
        if (!usuarioADesactivar) return;

        const result = await Swal.fire({
            title: '¿Estás seguro de desactivar el registro?',
            html: `Vas a desactivar a <strong>${usuarioADesactivar.nombre}</strong>. No podrá acceder al sistema.`,
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
            await usuarioService.delete(id);
            
            // EN LUGAR DE MARCAR COMO INACTIVO, ELIMINAR DEL CACHE
            setUsuariosCache(prev => prev.filter(u => u.id !== id));
            
        } catch (err) { 
            Swal.fire('Error', 'No se pudo desactivar el usuario', 'error');
        }
    };

    const handleFormSubmit = async (usuarioData) => {
        try {
            const payload = {
                IdRol: Number(usuarioData.idRol),
                Nombre: usuarioData.nombre,
                Correo: usuarioData.correo,
                Estado: usuarioData.estado ? 1 : 0
            };

            if (usuarioData.password && usuarioData.password.trim()) {
                payload.Password = usuarioData.password;
            }

            if (editingUsuario && editingUsuario.id) {
                await usuarioService.update(editingUsuario.id, payload);
                
                if (usuarioData.estado) {
                    // Si se activa, actualizar en el cache
                    setUsuariosCache(prev => {
                        const index = prev.findIndex(u => u.id === editingUsuario.id);
                        if (index === -1) return prev;
                        
                        const nuevoArray = [...prev];
                        nuevoArray[index] = {
                            ...nuevoArray[index],
                            idRol: Number(usuarioData.idRol),
                            nombre: usuarioData.nombre,
                            correo: usuarioData.correo,
                            estado: true
                        };
                        
                        return nuevoArray;
                    });
                } else {
                    // Si se desactiva, ELIMINAR del cache
                    setUsuariosCache(prev => prev.filter(u => u.id !== editingUsuario.id));
                }
            } else {
                await usuarioService.create(payload);
                
                // Calcular la última página después de agregar el nuevo usuario
                const totalUsuariosDespues = usuariosCache.length + 1;
                const ultimaPagina = Math.ceil(totalUsuariosDespues / itemsPerPage);
                
                setTimeout(async () => {
                    await loadUsuarios();
                    // Mover automáticamente a la última página (donde está el nuevo usuario)
                    setCurrentPage(ultimaPagina);
                }, 500);
            }

            setShowForm(false);
            setEditingUsuario(null);
            
        } catch (err) { 
            console.error('Error en handleFormSubmit:', err);
        }
    };

    const handleCancel = () => {
        if (editingUsuario?.nombre) {
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
                    setEditingUsuario(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingUsuario(null);
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
                <h1 className="management-title">Gestión de Usuarios</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Usuario
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <UsuarioForm 
                    usuario={editingUsuario} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancel} 
                />
            ) : (
                <>
                    <UsuarioList
                        usuarios={currentPageUsuarios}
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

export default Usuarios;