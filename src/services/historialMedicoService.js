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

const historialMedicoService = {
    // Obtener todos los historiales médicos
    getAll: async () => {
        try {
            const response = await api.get('/historialmedico/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener historiales médicos');
        }
    },

    // Obtener historial por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/historialmedico/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el historial médico');
        }
    },

    // Obtener historiales por paciente
    getByPaciente: async (idPaciente) => {
        try {
            const response = await api.get(`/historialmedico/paciente/${idPaciente}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener historiales del paciente');
        }
    },

    // Obtener historial por cita
    getByCita: async (idCita) => {
        try {
            const response = await api.get(`/historialmedico/cita/${idCita}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener historial de la cita');
        }
    },

    // Crear nuevo historial médico
    create: async (historialData) => {
        try {
            const dataToSend = {
                ...historialData,
                estado: 1,
                fechahora: new Date().toISOString()
            };

            const response = await api.post('/historialmedico/create', dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Historial médico creado correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el historial médico');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear historial',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar historial médico
    update: async (id, historialData) => {
        try {
            const response = await api.put(`/historialmedico/update/${id}`, historialData, {
                headers: { 'Content-Type': 'application/json' }
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Historial médico actualizado correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al actualizar el historial médico');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar historial',
                text: display
            });

            throw apiData || new Error(display);
        }
    },

    // Eliminar historial médico (cambiar estado a inactivo)
    delete: async (id) => {
        try {
            const response = await api.delete(`/historialmedico/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El historial médico fue eliminado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar historial',
                text: apiData?.message || 'No se pudo eliminar el historial médico'
            });

            throw apiData || new Error('Error al eliminar historial médico');
        }
    }
};

export default historialMedicoService;