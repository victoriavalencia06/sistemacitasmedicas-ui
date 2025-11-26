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

// Helper: formatea Date o string a YYYY-MM-DD
function formatDateKey(input) {
    if (!input) return null;
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

const citaService = {
    // caches simples en memoria
    _monthCache: {},   // key: 'YYYY-MM' -> array de citas
    _dayCache: {},     // key: 'YYYY-MM-DD' -> array de citas
    _countsCache: {},  // key: 'YYYY-MM' -> { 'YYYY-MM-DD': n }

    /* ---------- MÉTODOS BÁSICOS ---------- */
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

    /* ---------- MÉTODOS PARA DATOS DEL FORMULARIO ---------- */
    getUsuariosActivos: async () => {
        try {
            console.log('🔍 Obteniendo usuarios activos...');
            const response = await api.get('/usuario/getAll');
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
            const response = await api.get('/doctor/getAll');
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
            const response = await api.get('/paciente/getAll');
            const pacientes = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const pacientesActivos = pacientes.filter(paciente => paciente.estado === true || paciente.estado === 1);
            console.log('✅ Pacientes activos:', pacientesActivos);
            return pacientesActivos;
        } catch (error) {
            console.error('❌ Error al obtener pacientes activos:', error);
            return [];
        }
    },

    /* ---------- MÉTODOS PARA CALENDARIO ---------- */
    getByMonth: async (year, month, forceRefresh = false) => {
        try {
            const key = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
            if (!forceRefresh && citaService._monthCache[key]) {
                console.log(`📦 Usando cache month ${key}`);
                return citaService._monthCache[key];
            }

            console.log(`🔍 Obteniendo citas del mes ${key}...`);
            const response = await api.get(`/cita/month?year=${year}&month=${month}`);
            let data = response.data;

            let appointments = Array.isArray(data) ? data : (data?.appointments || data?.appointments || []);

            if (!Array.isArray(appointments) && typeof appointments === 'object') {
                appointments = Object.values(appointments).flat ? Object.values(appointments).flat() : [];
            }

            citaService._monthCache[key] = appointments;
            console.log(`✅ Month ${key} cargado. Total: ${appointments.length}`);
            return appointments;
        } catch (error) {
            console.error('❌ Error en GET BY MONTH:', error);
            throw error.response?.data || new Error('Error al obtener citas por mes');
        }
    },

    getCountsByMonth: async (year, month, forceRefresh = false) => {
        try {
            const key = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
            if (!forceRefresh && citaService._countsCache[key]) {
                console.log(`📦 Usando cache counts ${key}`);
                return citaService._countsCache[key];
            }

            console.log(`🔍 Obteniendo counts para ${key}...`);
            const response = await api.get(`/cita/counts/month?year=${year}&month=${month}`);
            let data = response.data;

            let counts = {};
            if (data == null) counts = {};
            else if (data.counts && typeof data.counts === 'object') counts = data.counts;
            else if (typeof data === 'object' && !Array.isArray(data)) {
                counts = data.counts || data;
            }

            citaService._countsCache[key] = counts;
            console.log(`✅ Counts ${key} cargado. Días con citas: ${Object.keys(counts).length}`);
            return counts;
        } catch (error) {
            console.error('❌ Error en GET COUNTS BY MONTH:', error);
            throw error.response?.data || new Error('Error al obtener conteos por mes');
        }
    },

    getByDay: async (date, forceRefresh = false) => {
        try {
            const key = formatDateKey(date);
            if (!key) throw new Error('Fecha inválida');

            if (!forceRefresh && citaService._dayCache[key]) {
                console.log(`📦 Usando cache day ${key}`);
                return citaService._dayCache[key];
            }

            console.log(`🔍 Obteniendo citas del día ${key}...`);
            const response = await api.get(`/cita/day?date=${key}`);
            let data = response.data;

            let appointments = [];
            if (Array.isArray(data)) appointments = data;
            else if (Array.isArray(data?.appointments)) appointments = data.appointments;
            else if (data?.appointments && typeof data.appointments === 'object') {
                appointments = Array.isArray(data.appointments) ? data.appointments : Object.values(data.appointments).flat();
            }

            citaService._dayCache[key] = appointments;
            console.log(`✅ Day ${key} cargado: ${appointments.length} citas`);
            return appointments;
        } catch (error) {
            console.error('❌ Error en GET BY DAY:', error);
            throw error.response?.data || new Error('Error al obtener citas por día');
        }
    },

    getAvailableSlots: async (date = new Date(), slotsPerDay = 20) => {
        try {
            const dayKey = formatDateKey(date);
            if (!dayKey) throw new Error('Fecha inválida para cupos');

            console.log(`🔍 Obteniendo cupos disponibles para ${dayKey} (slotsPerDay=${slotsPerDay})`);
            const response = await api.get(`/cita/cupos-disponibles?date=${dayKey}&slotsPerDay=${slotsPerDay}`);
            const data = response.data;

            if (data == null) return { date: dayKey, totalCupos: slotsPerDay, citasConfirmadas: 0, cuposDisponibles: slotsPerDay };

            const fecha = data.fecha ?? data.Fecha ?? data.date ?? dayKey;
            const total = data.totalCupos ?? data.TotalCupos ?? data.total ?? slotsPerDay;
            const confirmed = data.citasConfirmadas ?? data.CitasConfirmadas ?? data.confirmed ?? 0;
            const available = data.cuposDisponibles ?? data.CuposDisponibles ?? data.availableSlots ?? Math.max(0, total - confirmed);

            return {
                date: fecha,
                totalCupos: Number(total),
                citasConfirmadas: Number(confirmed),
                cuposDisponibles: Number(available)
            };
        } catch (error) {
            console.error('Error en getAvailableSlots:', error);
            throw error.response?.data || new Error('Error al obtener cupos disponibles');
        }
    },

    /* ---------- MÉTODOS CRUD ---------- */
    create: async (citaData) => {
        try {
            console.log('🎯 Service CREATE llamado con:', citaData);

            if (!citaData.idUsuario || !citaData.idPaciente || !citaData.idDoctor || !citaData.fechaHora) {
                throw new Error('Todos los campos son requeridos (Usuario, Paciente, Doctor, Fecha y Hora)');
            }

            const fechaHoraSeleccionada = new Date(citaData.fechaHora).toISOString();
            console.log('🕐 Usando fecha/hora seleccionada:', fechaHoraSeleccionada);

            const payload = {
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHoraSeleccionada,
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

            // invalidar caches del mes y dia relacionados
            const keyMonth = fechaHoraSeleccionada.slice(0, 7);
            const keyDay = fechaHoraSeleccionada.slice(0, 10);
            delete citaService._monthCache[keyMonth];
            delete citaService._dayCache[keyDay];
            delete citaService._countsCache[keyMonth];

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

            if (!citaData.fechaHora) {
                throw new Error('La fecha y hora son requeridas');
            }

            const fechaHoraSeleccionada = new Date(citaData.fechaHora).toISOString();

            const payload = {
                idCita: parseInt(id),
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHoraSeleccionada,
                estado: citaData.estado ? 1 : 0
            };

            console.log(`📤 Enviando PUT a /cita/update/${id} con payload:`, JSON.stringify(payload, null, 2));

            const response = await api.put(`/cita/update/${id}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            // invalidar caches del mes y dia relacionados
            const keyMonth = fechaHoraSeleccionada.slice(0, 7);
            const keyDay = fechaHoraSeleccionada.slice(0, 10);
            delete citaService._monthCache[keyMonth];
            delete citaService._dayCache[keyDay];
            delete citaService._countsCache[keyMonth];

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

            // invalidar caches relevantes
            citaService._monthCache = {};
            citaService._dayCache = {};
            citaService._countsCache = {};

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
    },

    /* ---------- MÉTODOS AUXILIARES ---------- */
    clearCaches: () => {
        citaService._monthCache = {};
        citaService._dayCache = {};
        citaService._countsCache = {};
        console.log('Caches limpiadas.');
    }
};

export default citaService;