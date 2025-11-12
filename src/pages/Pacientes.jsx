import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import PacienteList from '../components/pacientes/PacienteList';
import PacienteForm from '../components/pacientes/PacienteForm';
import pacienteService from '../services/pacienteService';
import Swal from 'sweetalert2';
import AlertMessage from '../components/common/AlertMessage';
import Pagination from '../components/common/Pagination';
import '../assets/styles/Management.css';

const Pacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPaciente, setEditingPaciente] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredPacientes = useMemo(() => {
        let result = [...pacientes];
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(term) ||
                p.apellido.toLowerCase().includes(term) ||
                p.telefono.includes(term) ||
                p.seguro.toLowerCase().includes(term)
            );
        }
        return result;
    }, [pacientes, searchTerm]);

    const currentPagePacientes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPacientes.slice(startIndex, endIndex);
    }, [filteredPacientes, currentPage, itemsPerPage]);

    const totalItems = filteredPacientes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        loadPacientes();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const loadPacientes = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await pacienteService.getAll();
            const rawList = Array.isArray(data) ? data : (data.items || []);

            const mapped = rawList.map((p, index) => {
                const resolvedId = p.idPaciente ?? p.idpaciente ?? p.IdPaciente ?? p.id ?? p.Id ?? null;
                return {
                    id: resolvedId != null && typeof resolvedId === 'string' && /^\d+$/.test(resolvedId)
                        ? Number(resolvedId)
                        : resolvedId,
                    _key: resolvedId != null ? `idPaciente-${resolvedId}` : `fallback-${index}`,
                    idUsuario: p.idUsuario ?? p.idusuario ?? p.IdUsuario ?? 0,
                    nombre: p.nombre ?? p.Nombre ?? '',
                    apellido: p.apellido ?? p.Apellido ?? '',
                    fechaNacimiento: p.fechaNacimiento ?? p.fechanacimiento ?? p.FechaNacimiento ?? '',
                    telefono: p.telefono ?? p.Telefono ?? '',
                    direccion: p.direccion ?? p.Direccion ?? '',
                    seguro: p.seguro ?? p.Seguro ?? '',
                    estado: p.estado === 1 || p.estado === true || String(p.estado) === '1'
                };
            });

            setPacientes(mapped);
        } catch (err) {
            const errorMessage = err?.message || 'Error al cargar los pacientes';
            setError(errorMessage);
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPaciente(null);
        setShowForm(true);
    };

    const handleEdit = (paciente) => {
        setEditingPaciente(paciente);
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
            await pacienteService.delete(id);
            await loadPacientes();
        } catch (err) { }
    };
    // En el archivo Pacientes.js, solo actualiza la función handleFormSubmit:
  const handleFormSubmit = async (pacienteData) => {
    console.log('🔍 DATOS RECIBIDOS DEL FORMULARIO:', pacienteData);
    
    try {
        const payload = {
            idPaciente: 0,
            idUsuario: parseInt(pacienteData.idUsuario) || 0,
            nombre: pacienteData.nombre ?? '',
            apellido: pacienteData.apellido ?? '',
            fechaNacimiento: pacienteData.fechaNacimiento ?? '',
            telefono: pacienteData.telefono ?? '',
            direccion: pacienteData.direccion ?? '',
            seguro: pacienteData.seguro ?? '',
            estado: pacienteData.estado ? 1 : 0
        };

        console.log('📤 PAYLOAD A ENVIAR:', payload);
        console.log('📋 TIPOS DE DATOS:');
        Object.keys(payload).forEach(key => {
            console.log(`  - ${key}:`, typeof payload[key], payload[key]);
        });

        if (editingPaciente && editingPaciente.id) {
            payload.idPaciente = editingPaciente.id;
            console.log('🔄 EDITANDO paciente ID:', editingPaciente.id);
            await pacienteService.update(editingPaciente.id, payload);
        } else {
            console.log('🆕 CREANDO nuevo paciente');
            await pacienteService.create(payload);
        }

        setShowForm(false);
        setEditingPaciente(null);
        await loadPacientes();
    } catch (err) {
        console.error('❌ ERROR completo:', err);
    }
};

    const handleCancel = () => {
        if (editingPaciente?.nombre) {
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
                    setEditingPaciente(null);
                }
            });
        } else {
            setShowForm(false);
            setEditingPaciente(null);
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
                <h1 className="management-title">Gestión de Pacientes</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Paciente
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido, teléfono o seguro..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <AlertMessage type="error" message={error} />

            {showForm ? (
                <PacienteForm 
                    paciente={editingPaciente} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancel} 
                />
            ) : (
                <>
                    <PacienteList
                        pacientes={currentPagePacientes}
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

export default Pacientes;