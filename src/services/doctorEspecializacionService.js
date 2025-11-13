import api from '../api/axios';
import Swal from 'sweetalert2';

const doctorEspecializacionService = {
    // Obtener especializaciones de un doctor
    getByDoctor: async (doctorId) => {
        try {
            const response = await api.get(`/doctorEspecializacion/getByDoctor/${doctorId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener especializaciones del doctor');
        }
    },

    // Asignar especialización a doctor
    asignar: async (doctorId, especializacionId) => {
        try {
            const response = await api.post(`/doctorEspecializacion/asignar?doctorId=${doctorId}&especializacionId=${especializacionId}`);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            await Swal.fire({
                icon: 'error',
                title: 'Error al asignar especialización',
                text: apiData?.message || 'No se pudo asignar la especialización'
            });
            throw apiData || new Error('Error al asignar especialización');
        }
    },

    // Quitar especialización de doctor
    quitar: async (doctorId, especializacionId) => {
        try {
            const response = await api.delete(`/doctorEspecializacion/quitar?doctorId=${doctorId}&especializacionId=${especializacionId}`);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            await Swal.fire({
                icon: 'error',
                title: 'Error al remover especialización',
                text: apiData?.message || 'No se pudo remover la especialización'
            });
            throw apiData || new Error('Error al remover especialización');
        }
    }
};

export default doctorEspecializacionService;