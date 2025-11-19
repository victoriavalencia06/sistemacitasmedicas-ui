// services/rolService.js (ACTUALIZADO)
import api from "../api/axios";
import Swal from 'sweetalert2';

// Extrae mensajes de validación de la API
function extractValidationMessages(apiData) {
    const msgs = [];
    const errors = apiData?.errors;

    if (!errors) {
        if (apiData?.message) msgs.push(apiData.message);
        return msgs;
    }

    for (const key of Object.keys(errors)) {
        const arr = errors[key];
        if (Array.isArray(arr)) arr.forEach(m => msgs.push(`${key}: ${m}`));
        else msgs.push(`${key}: ${String(arr)}`);
    }
    return msgs;
}

const rolService = {
    // ✅ NUEVOS MÉTODOS PARA PERMISOS
    
    // Obtener todos los roles con permisos (nuevo endpoint)
    getAllWithPermissions: async () => {
        try {
            const response = await api.get('/rol');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener roles con permisos');
        }
    },

    // Obtener un rol específico con sus permisos
    getWithPermissions: async (id) => {
        try {
            const response = await api.get(`/rol/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el rol con permisos');
        }
    },

    // Crear rol con permisos (nuevo endpoint)
    createWithPermissions: async (rolData) => {
        try {
            const response = await api.post('/rol', rolData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Rol creado correctamente con sus permisos',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el rol');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear rol',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar rol con permisos (nuevo endpoint)
    updateWithPermissions: async (id, rolData) => {
        try {
            const response = await api.put(`/rol/${id}`, rolData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Rol y permisos actualizados correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al actualizar el rol');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar rol',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Obtener todos los menús disponibles
    getAllMenus: async () => {
        try {
            const response = await api.get('/rol/menus');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener menús');
        }
    },

    // Obtener menús por rol
    getMenusByRol: async (idRol) => {
        try {
            const response = await api.get(`/rol/${idRol}/menus`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener menús del rol');
        }
    },

    // Alternar permiso individual
    togglePermission: async (idRol, idMenu, habilitado) => {
        try {
            const response = await api.put(`/rol/togglePermiso?idRol=${idRol}&idMenu=${idMenu}&habilitado=${habilitado}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al actualizar permiso');
        }
    },

    // Desactivar rol (nuevo endpoint)
    deactivate: async (id) => {
        try {
            await api.delete(`/rol/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Desactivado',
                text: 'El rol fue desactivado',
                timer: 1200,
                showConfirmButton: false
            });

            return true;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al desactivar rol',
                text: apiData?.message || 'No se pudo desactivar el rol'
            });

            throw apiData || new Error('Error al desactivar rol');
        }
    },

    // Reactivar rol (nuevo endpoint)
    reactivate: async (id) => {
        try {
            await api.put(`/rol/${id}/reactivate`);

            await Swal.fire({
                icon: 'success',
                title: 'Reactivado',
                text: 'El rol fue reactivado',
                timer: 1200,
                showConfirmButton: false
            });

            return true;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al reactivar rol',
                text: apiData?.message || 'No se pudo reactivar el rol'
            });

            throw apiData || new Error('Error al reactivar rol');
        }
    },

    // ✅ MÉTODOS LEGACY (para mantener compatibilidad)
    getAll: async () => {
        try {
            const response = await api.get('/rol/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener roles');
        }
    },

    create: async (rolData) => {
        try {
            const dataToSend = {
                ...rolData,
                estado: 1
            };

            const response = await api.post('/rol/create', dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Rol creado correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el rol');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear rol',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    update: async (id, rolData) => {
        try {
            const response = await api.put(`/rol/update/${id}`, rolData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Rol actualizado correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al actualizar el rol');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar rol',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/rol/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El rol fue eliminado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar rol',
                text: apiData?.message || 'No se pudo eliminar el rol'
            });

            throw apiData || new Error('Error al eliminar rol');
        }
    }
};

export default rolService;