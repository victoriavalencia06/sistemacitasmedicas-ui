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

const especializacionService = {
    // Obtener todas las especializaciones
    getAll: async () => {
        try {
            const response = await api.get('/especializacion/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener especializaciones');
        }
    },

    // Obtener una especialización por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/especializacion/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener la especialización');
        }
    },

    // Crear nueva especialización - datos: { Nombre: string, Descripcion: string, Estado: number }
    create: async (especializacionData) => {
        try {
            const response = await api.post('/especializacion/create', especializacionData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Especialización creada correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al crear la especialización');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear especialización',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar especialización - datos: { Nombre: string, Descripcion: string, Estado: number }
    update: async (id, especializacionData) => {
        try {
            const response = await api.put(`/especializacion/update/${id}`, especializacionData, {
                headers: { 'Content-Type': 'application/json' }
            });
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Especialización actualizada correctamente',
                timer: 1400,
                showConfirmButton: false
            });
            return response.data;
        } catch (error) {
            console.error('especializacionService.update error:', error);
            // Reenviamos el error con la info del servidor para que el caller lo maneje
            throw error;
        }
    },


    // Eliminar especialización
    delete: async (id) => {
        try {
            const response = await api.delete(`/especializacion/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La especialización fue eliminada',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar especialización',
                text: apiData?.message || 'No se pudo eliminar la especialización'
            });

            throw apiData || new Error('Error al eliminar especialización');
        }
    }
};

export default especializacionService;