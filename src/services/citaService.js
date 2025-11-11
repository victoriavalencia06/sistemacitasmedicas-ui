import api from '../api/axios';
import Swal from 'sweetalert2';

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

const citaService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todas las citas...');
            const response = await api.get('/cita/getAll');
            console.log('✅ Respuesta de GET ALL:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error en GET ALL:', error);
            throw error.response?.data || new Error('Error al obtener citas');
        }
    },

    getById: async (id) => {
        try {
            console.log(`🔍 Obteniendo cita con ID: ${id}`);
            const response = await api.get(`/cita/get/${id}`);
            console.log(`✅ Respuesta de GET BY ID ${id}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ Error en GET BY ID ${id}:`, error);
            throw error.response?.data || new Error('Error al obtener la cita');
        }
    },

    // Nuevos métodos para obtener usuarios y doctores
    getUsuariosActivos: async () => {
        try {
            console.log('🔍 Obteniendo usuarios activos...');
            const response = await api.get('/usuario/getAll'); // Ajusta la ruta según tu API
            const usuarios = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const usuariosActivos = usuarios.filter(usuario => usuario.estado === true || usuario.estado === 1);
            console.log('✅ Usuarios activos:', usuariosActivos);
            return usuariosActivos;
        } catch (error) {
            console.error('❌ Error al obtener usuarios activos:', error);
            return [];
        }
    },

    getDoctoresActivos: async () => {
        try {
            console.log('🔍 Obteniendo doctores activos...');
            const response = await api.get('/doctor/getAll'); // Ajusta la ruta según tu API
            const doctores = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const doctoresActivos = doctores.filter(doctor => doctor.estado === true || doctor.estado === 1);
            console.log('✅ Doctores activos:', doctoresActivos);
            return doctoresActivos;
        } catch (error) {
            console.error('❌ Error al obtener doctores activos:', error);
            return [];
        }
    },

    getPacientesActivos: async () => {
        try {
            console.log('🔍 Obteniendo pacientes activos...');
            const response = await api.get('/paciente/getAll'); // Ajusta la ruta según tu API
            const pacientes = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const pacientesActivos = pacientes.filter(paciente => paciente.estado === true || paciente.estado === 1);
            console.log('✅ Pacientes activos:', pacientesActivos);
            return pacientesActivos;
        } catch (error) {
            console.error('❌ Error al obtener pacientes activos:', error);
            return [];
        }
    },

    create: async (citaData) => {
        try {
            console.log('🎯 Service CREATE llamado con:', citaData);
            
            // Validar que todos los campos requeridos estén presentes
            if (!citaData.idUsuario || !citaData.idPaciente || !citaData.idDoctor) {
                throw new Error('Todos los campos son requeridos (Usuario, Paciente, Doctor)');
            }

            // Usar fecha y hora actual
            const fechaHoraActual = new Date().toISOString();
            console.log('🕐 Usando fecha/hora actual:', fechaHoraActual);

            // PAYLOAD CORREGIDO
            const payload = {
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHoraActual, // Siempre fecha actual
                estado: citaData.estado ? 1 : 0
            };

            console.log('📤 Payload final:', JSON.stringify(payload, null, 2));

            const response = await api.post('/cita/create', payload, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('✅ Cita creada exitosamente:', response.data);

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Cita creada correctamente',
                timer: 1400,
                showConfirmButton: false
            });

            return response.data;
            
        } catch (error) {
            console.error('❌ ERROR en service CREATE:', error);
            console.error('🔢 Status:', error.response?.status);
            console.error('📦 Data:', error.response?.data);
            
            let errorMessage = 'Error al crear la cita';
            
            if (error.response?.data) {
                const apiData = error.response.data;
                const msgs = extractValidationMessages(apiData);
                errorMessage = msgs.length ? msgs.join('\n') : (apiData?.message || errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error al crear cita',
                text: errorMessage,
                width: 600
            });

            throw error;
        }
    },

    update: async (id, citaData) => {
        try {
            console.log(`🎯 Service UPDATE llamado para ID: ${id}`, citaData);
            
            // Para update, mantener la fecha original o usar la actual según necesites
            const fechaHora = citaData.fechaHoraOriginal || new Date().toISOString();

            // PAYLOAD para update
            const payload = {
                idCita: parseInt(id),
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHora,
                estado: citaData.estado ? 1 : 0
            };

            console.log(`📤 Enviando PUT a /cita/update/${id} con payload:`, JSON.stringify(payload, null, 2));
            
            const response = await api.put(`/cita/update/${id}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log(`✅ Cita actualizada:`, response.data);

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Cita actualizada correctamente',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            console.error(`❌ Error en UPDATE ${id}:`, error);
            console.error('❌ Response data:', error.response?.data);
            
            let errorMessage = 'Error al actualizar la cita';
            
            if (error.response?.data) {
                const apiData = error.response.data;
                const msgs = extractValidationMessages(apiData);
                errorMessage = msgs.length ? msgs.join('\n') : (apiData?.message || errorMessage);
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar cita',
                text: errorMessage
            });

            throw error;
        }
    },

    delete: async (id) => {
        try {
            console.log(`🗑️ Service DELETE llamado para ID: ${id}`);
            const response = await api.delete(`/cita/delete/${id}`);
            
            console.log(`✅ Respuesta de DELETE ${id}:`, response.data);

            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La cita fue eliminada correctamente',
                timer: 1200,
                showConfirmButton: false
            });
            
            return response.data;
        } catch (error) {
            console.error(`❌ Error en service DELETE ${id}:`, error);
            console.error('❌ Response data:', error.response?.data);

            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar cita',
                text: apiData?.message || 'No se pudo eliminar la cita'
            });

            throw apiData || new Error('Error al eliminar cita');
        }
    }
};

export default citaService;