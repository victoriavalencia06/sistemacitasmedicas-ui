import React, { useState, useEffect, useContext } from 'react';
import { 
  FaUserTag, 
  FaSave, 
  FaPlus, 
  FaTimes, 
  FaExclamationCircle, 
  FaLock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PermissionManager from './PermissionManager';
import rolService from '../../services/rolService';
import { AuthContext } from '../../context/AuthContext'; // ✅ IMPORTAR CONTEXTO

const RolForm = ({ rol, onSubmit, onCancel }) => {
    const navigate = useNavigate();
    const { refreshPermissions } = useContext(AuthContext); // ✅ OBTENER FUNCIÓN DEL CONTEXTO
    const [formData, setFormData] = useState({
        nombre: '',
        estado: true
    });
    const [permissions, setPermissions] = useState([]);
    const [showPermissions, setShowPermissions] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    // ✅ CARGAR PERMISOS EXISTENTES AL EDITAR
    useEffect(() => {
        const loadRolePermissions = async () => {
            if (rol && rol.id) {
                setLoadingPermissions(true);
                try {
                    const rolePermissions = await rolService.getMenusByRol(rol.id);
                    // Mapear a la estructura esperada
                    const mappedPermissions = rolePermissions.map(p => ({
                        menuId: p.menuId,
                        habilitado: p.habilitado
                    }));
                    setPermissions(mappedPermissions);
                } catch (error) {
                    console.error('Error cargando permisos:', error);
                    Swal.fire('Error', 'No se pudieron cargar los permisos del rol', 'error');
                } finally {
                    setLoadingPermissions(false);
                }
            }
        };

        if (rol) {
            setFormData({
                nombre: rol.nombre ?? '',
                estado: rol.estado ?? true
            });
            setShowPermissions(true);
            loadRolePermissions();
        } else {
            setFormData({ nombre: '', estado: true });
            setPermissions([]);
        }
    }, [rol]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleToggle = () => {
        setFormData(prev => ({
            ...prev,
            estado: !prev.estado
        }));
    };

    const handlePermissionChange = (menuId, habilitado) => {
        setPermissions(prev => {
            const existing = prev.find(p => p.menuId === menuId);
            if (existing) {
                return prev.map(p => 
                    p.menuId === menuId ? { ...p, habilitado } : p
                );
            } else {
                return [...prev, { menuId, habilitado }];
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del rol es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // ✅ Asegurar que permissions tenga todos los menús, no solo los modificados
        const payload = {
            nombre: formData.nombre.trim(),
            estado: formData.estado ? 1 : 0,
            permisos: permissions.length > 0 ? permissions : []
        };

        if (rol && !formData.estado) {
            const result = await Swal.fire({
                title: 'Vas a dejar el rol inactivo',
                html: 'Si guardas este rol como <strong>inactivo</strong>, no podrá ser asignado ni utilizado en el sistema. ¿Deseas continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar inactivo',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        // ✅ LLAMAR A LA FUNCIÓN onSubmit QUE VIENE DEL COMPONENTE PADRE
        await onSubmit(payload);
        
        // ✅ ACTUALIZAR PERMISOS EN EL CONTEXTO
        refreshPermissions();
        
        // ✅ REDIRIGIR A LA MISMA RUTA SIN RECARGAR
        navigate('/dashboard/roles', { replace: true });
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUserTag style={{ marginRight: 8 }} />
                    {rol ? 'Editar Rol y Permisos' : 'Crear Nuevo Rol'}
                </h2>
                <p className="management-form-subtitle">
                    {rol
                        ? 'Actualiza la información del rol y sus permisos de acceso'
                        : 'Completa la información para crear un nuevo rol'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                        Nombre del Rol
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ej: Administrador, Doctor, Paciente..."
                    />
                    {errors.nombre && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.nombre}
                        </div>
                    )}
                </div>

                {rol ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Rol</label>
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={formData.estado}
                                    onChange={handleToggle}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="switch-label">
                                {formData.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        {!formData.estado && (
                            <div className="inline-warning" role="status">
                                <strong>Atención:</strong> si guarda el rol inactivo, no podrá ser usado ni asignado.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Estado del Rol</label>
                        <p className="text-muted">
                            Este rol está <strong>activo por defecto</strong>.
                        </p>
                    </div>
                )}

                {/* Gestor de permisos - solo para edición */}
                {rol && (
                    <div className="form-group">
                        <button
                            type="button"
                            className="btn-permission-toggle"
                            onClick={() => setShowPermissions(!showPermissions)}
                        >
                            <FaLock style={{ marginRight: 8 }} />
                            {showPermissions ? 'Ocultar Permisos' : 'Gestionar Permisos'}
                        </button>
                        
                        {showPermissions && (
                            <PermissionManager 
                                rolId={rol.id} 
                                onPermissionsChange={handlePermissionChange}
                                initialPermissions={permissions}
                                loading={loadingPermissions}
                            />
                        )}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-management btn-management-secondary"
                    >
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button type="submit" className="btn-management">
                        {rol ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Rol
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Rol
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RolForm;