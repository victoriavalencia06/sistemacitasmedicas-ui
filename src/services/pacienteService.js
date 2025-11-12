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

const pacienteService = {
    // Obtener todos los pacientes
    getAll: async () => {
        try {
            const response = await api.get('/paciente/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener pacientes');
        }
    },

    // Obtener un paciente por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/paciente/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el paciente');
        }
    },

    // Obtener usuarios disponibles
    getUsuariosDisponibles: async () => {
        try {
            const response = await api.get('/usuario/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener usuarios');
        }
    },

    // Crear nuevo paciente
    create: async (pacienteData) => {
        try {
            const response = await api.post('/paciente/create', pacienteData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Paciente creado correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el paciente');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear paciente',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar paciente
    update: async (id, pacienteData) => {
        try {
            const response = await api.put(`/paciente/update/${id}`, pacienteData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Paciente actualizado correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al actualizar el paciente');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar paciente',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Eliminar paciente
    delete: async (id) => {
        try {
            const response = await api.delete(`/paciente/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El paciente fue eliminado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar paciente',
                text: apiData?.message || 'No se pudo eliminar el paciente'
            });

            throw apiData || new Error('Error al eliminar paciente');
        }
    }
};

export default pacienteService;