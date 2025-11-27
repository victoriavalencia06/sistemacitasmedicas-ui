import api from '../api/axios';
import Swal from 'sweetalert2';

// Extrae mensajes de validación de la API
function extractValidationMessages(apiData) {
    const msgs = [];
    const errors = apiData?.errors;

    if (!errors) {
        if (apiData?.message) msgs.push(apiData.message);
        if (apiData?.error) msgs.push(apiData.error); // Para errores del controlador
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
            const response = await api.get('/doctor-completo');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener doctores');
        }
    },

    // Obtener doctores activos
    getActivos: async () => {
        try {
            const response = await api.get('/doctor-completo/activos');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener doctores activos');
        }
    },

    // Obtener un doctor por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/doctor-completo/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el doctor');
        }
    },

    // Crear nuevo doctor completo
    create: async (doctorData) => {
        try {
            console.log('🚀 ENVIANDO CREATE - Datos:', doctorData);
            
            // Limpiar el payload - NO enviar idRol
            const { idRol, ...cleanData } = doctorData;
            
            const response = await api.post('/doctor-completo/create', cleanData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('✅ CREATE EXITOSO - Respuesta:', response.data);

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Doctor creado correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            console.error('❌ CREATE ERROR - Detalles:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });

            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al crear el doctor');

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear doctor',
                text: display,
                width: '600px'
            });

            throw apiData || new Error(display);
        }
    },

    // Actualizar doctor completo
    update: async (id, doctorData) => {
        try {
            console.log('🚀 ENVIANDO UPDATE - ID:', id, 'Datos:', doctorData);
            
            // Limpiar el payload - NO enviar idRol
            const { idRol, ...cleanData } = doctorData;
            
            const response = await api.put('/doctor-completo/update', cleanData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('✅ UPDATE EXITOSO - Respuesta:', response.data);

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Doctor actualizado correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            console.error('❌ UPDATE ERROR - Detalles:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });

            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);
            const display = msgs.length
                ? msgs.join('\n')
                : (apiData?.message || 'Error al actualizar el doctor');

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar doctor',
                text: display,
                width: '600px'
            });

            throw apiData || new Error(display);
        }
    },

    // Desactivar doctor completo
    desactivar: async (id) => {
        try {
            const response = await api.put(`/doctor-completo/desactivar/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Desactivado',
                text: 'El doctor fue desactivado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al desactivar doctor',
                text: apiData?.message || 'No se pudo desactivar el doctor'
            });

            throw apiData || new Error('Error al desactivar doctor');
        }
    },

    // Activar doctor completo
    activar: async (id) => {
        try {
            const response = await api.put(`/doctor-completo/activar/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Activado',
                text: 'El doctor fue activado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al activar doctor',
                text: apiData?.message || 'No se pudo activar el doctor'
            });

            throw apiData || new Error('Error al activar doctor');
        }
    }
};

export default doctorService;