import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaLock, FaLockOpen } from 'react-icons/fa';
import rolService from '../../services/rolService';

const PermissionManager = ({ rolId, onPermissionsChange, initialPermissions = [], loading }) => {
    const [menus, setMenus] = useState([]);
    const [roleMenus, setRoleMenus] = useState(initialPermissions);

    // Sincronizar con initialPermissions
    useEffect(() => {
        setRoleMenus(initialPermissions);
    }, [initialPermissions]);

    // Cargar menús disponibles
    useEffect(() => {
        const loadMenus = async () => {
            try {
                const menusData = await rolService.getAllMenus();
                setMenus(menusData);
            } catch (error) {
                console.error('Error loading menus:', error);
            }
        };

        loadMenus();
    }, []);

    const handlePermissionChange = async (menuId, habilitado) => {
        // Actualizar estado local inmediatamente
        const updatedRoleMenus = [...roleMenus];
        const existingIndex = updatedRoleMenus.findIndex(rm => rm.menuId === menuId);
        
        if (existingIndex >= 0) {
            updatedRoleMenus[existingIndex] = { ...updatedRoleMenus[existingIndex], habilitado };
        } else {
            updatedRoleMenus.push({ menuId, habilitado });
        }
        
        setRoleMenus(updatedRoleMenus);
        
        // Notificar al componente padre
        if (onPermissionsChange) {
            onPermissionsChange(menuId, habilitado);
        }
    };

    if (loading) {
        return (
            <div className="permission-loading">
                <div className="loading-spinner"></div>
                <p>Cargando permisos...</p>
            </div>
        );
    }

    return (
        <div className="permission-manager">
            <h4 className="permission-title">Gestión de Permisos</h4>
            <p className="permission-subtitle">
                Selecciona los menús a los que este rol tendrá acceso
            </p>

            <div className="permissions-grid">
                {menus.map(menu => {
                    const roleMenu = roleMenus.find(rm => rm.menuId === menu.idMenu);
                    const hasPermission = roleMenu?.habilitado ?? false;

                    return (
                        <div key={menu.idMenu} className={`permission-card ${hasPermission ? 'enabled' : 'disabled'}`}>
                            <div className="permission-header">
                                <h5 className="menu-name">{menu.nombre}</h5>
                                <span className="menu-path">{menu.ruta}</span>
                            </div>
                            
                            <div className="permission-actions">
                                <button
                                    type="button"
                                    className={`btn-permission ${hasPermission ? 'btn-enabled' : 'btn-disabled'}`}
                                    onClick={() => handlePermissionChange(menu.idMenu, !hasPermission)}
                                >
                                    {hasPermission ? (
                                        <>
                                            <FaLockOpen /> Habilitado
                                        </>
                                    ) : (
                                        <>
                                            <FaLock /> Deshabilitado
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PermissionManager;