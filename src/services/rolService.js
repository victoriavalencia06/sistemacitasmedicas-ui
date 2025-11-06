import api from '../api/axios';
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
    // Obtener todos los roles
    getAll: async () => {
        try {
            const response = await api.get('/rol/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener roles');
        }
    },

    // Obtener un rol por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/rol/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el rol');
        }
    },

    // Crear nuevo rol - datos: { Nombre: string, Estado: number }
    create: async (rolData) => {
        try {
            // Asignar el estado activo por defecto
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


    // Actualizar rol - datos: { idRol:int, Nombre: string, Estado: number }
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

    // Eliminar rol
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