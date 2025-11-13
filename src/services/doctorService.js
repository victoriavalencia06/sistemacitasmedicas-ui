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

const doctorService = {
    // Obtener todos los doctores
    getAll: async () => {
        try {
            const response = await api.get('/doctor/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener doctores');
        }
    },

    // Obtener un doctor por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/doctor/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el doctor');
        }
    },

    // Crear nuevo doctor
    create: async (doctorData) => {
        try {
            const dataToSend = {
                ...doctorData
            };

            const response = await api.post('/doctor/create', dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Doctor creado correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el doctor');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear doctor',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar doctor
    update: async (id, doctorData) => {
        try {
            const dataToSend = {
                ...doctorData
            };

            const response = await api.put(`/doctor/update/${id}`, dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Doctor actualizado correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al actualizar el doctor');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar doctor',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Eliminar doctor
    delete: async (id) => {
        try {
            const response = await api.delete(`/doctor/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El doctor fue eliminado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar doctor',
                text: apiData?.message || 'No se pudo eliminar el doctor'
            });

            throw apiData || new Error('Error al eliminar doctor');
        }
    }
};

export default doctorService;