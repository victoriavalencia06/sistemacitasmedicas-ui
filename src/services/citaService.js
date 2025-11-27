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

// Convierte un valor de <input type="datetime-local"> (ej: "2025-11-26T10:30")
// a un ISO UTC (ej: "2025-11-26T16:30:00.000Z") — interpreta el valor como hora local.
function datetimeLocalToUTC(datetimeLocal) {
    if (!datetimeLocal) return null;
    // datetimeLocal expected "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
    const [datePart, timePart = "00:00"] = datetimeLocal.split("T");
    const [year, month, day] = datePart.split('-').map(Number);
    const timeParts = timePart.split(':').map(Number);
    const hour = timeParts[0] || 0;
    const minute = timeParts[1] || 0;
    // Create UTC date from the local values:
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute));
    return d.toISOString();
}

// (opuesto) Convierte ISO del backend a valor para input datetime-local mostrando la hora local.
// Recibe algo tipo "2025-11-26T16:30:00Z" o "2025-11-26T16:30:00.000Z" y devuelve "YYYY-MM-DDTHH:mm"
function isoToDatetimeLocalInput(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    // Ajuste para obtener la representación local en formato ISO sin offset:
    const tzOffset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - tzOffset);
    return local.toISOString().slice(0, 16);
}

const citaService = {
    // caches simples en memoria
    _monthCache: {},   // key: 'YYYY-MM' -> array de citas
    _dayCache: {},     // key: 'YYYY-MM-DD' -> array de citas
    _countsCache: {},  // key: 'YYYY-MM' -> { 'YYYY-MM-DD': n }

    /* ---------- MÉTODOS BÁSICOS ---------- */
    getAll: async () => {
        try {
            const response = await api.get('/cita/getAll');
            // Devolvemos tal cual la API (frontend mapeará según necesite)
            return response.data;
        } catch (error) {
            console.error('❌ Error en GET ALL:', error);
            throw error.response?.data || new Error('Error al obtener citas');
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/cita/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error en GET BY ID ${id}:`, error);
            throw error.response?.data || new Error('Error al obtener la cita');
        }
    },

    /* ---------- MÉTODOS PARA DATOS DEL FORMULARIO ---------- */
    getUsuariosActivos: async () => {
        try {
            const response = await api.get('/usuario/getAll');
            const usuarios = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const usuariosActivos = usuarios.filter(usuario => usuario.estado === true || usuario.estado === 1);
            return usuariosActivos;
        } catch (error) {
            console.error('❌ Error al obtener usuarios activos:', error);
            return [];
        }
    },

    getDoctoresActivos: async () => {
        try {
            const response = await api.get('/doctor/getAll');
            const doctores = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const doctoresActivos = doctores.filter(doctor => doctor.estado === true || doctor.estado === 1);
            return doctoresActivos;
        } catch (error) {
            console.error('❌ Error al obtener doctores activos:', error);
            return [];
        }
    },

    getPacientesActivos: async () => {
        try {
            const response = await api.get('/paciente/getAll');
            const pacientes = Array.isArray(response.data) ? response.data : (response.data.items || []);
            const pacientesActivos = pacientes.filter(paciente => paciente.estado === true || paciente.estado === 1);
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
            if (!forceRefresh && citaService._monthCache[key]) return citaService._monthCache[key];

            const response = await api.get(`/cita/month?year=${year}&month=${month}`);
            let data = response.data;
            let appointments = Array.isArray(data) ? data : (data?.appointments || []);
            if (!Array.isArray(appointments) && typeof appointments === 'object') {
                appointments = Object.values(appointments).flat ? Object.values(appointments).flat() : [];
            }
            citaService._monthCache[key] = appointments;
            return appointments;
        } catch (error) {
            console.error('❌ Error en GET BY MONTH:', error);
            throw error.response?.data || new Error('Error al obtener citas por mes');
        }
    },

    getCountsByMonth: async (year, month, forceRefresh = false) => {
        try {
            const key = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
            if (!forceRefresh && citaService._countsCache[key]) return citaService._countsCache[key];

            const response = await api.get(`/cita/counts/month?year=${year}&month=${month}`);
            let data = response.data;
            let counts = {};
            if (data == null) counts = {};
            else if (data.counts && typeof data.counts === 'object') counts = data.counts;
            else if (typeof data === 'object' && !Array.isArray(data)) counts = data.counts || data;
            citaService._countsCache[key] = counts;
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

            if (!forceRefresh && citaService._dayCache[key]) return citaService._dayCache[key];

            const response = await api.get(`/cita/day?date=${key}`);
            let data = response.data;
            let appointments = [];
            if (Array.isArray(data)) appointments = data;
            else if (Array.isArray(data?.appointments)) appointments = data.appointments;
            else if (data?.appointments && typeof data.appointments === 'object') {
                appointments = Array.isArray(data.appointments) ? data.appointments : Object.values(data.appointments).flat();
            }
            citaService._dayCache[key] = appointments;
            return appointments;
        } catch (error) {
            console.error('❌ Error en GET BY DAY:', error);
            throw error.response?.data || new Error('Error al obtener citas por día');
        }
    },

    // Obtener cupos disponibles
    getAvailableSlots: async (date = new Date(), slotsPerDay = 20) => {
        try {
            const key = formatDateKey(date);
            if (!key) throw new Error('Fecha inválida para cupos disponibles');

            console.log(`🔍 solicitando cupos disponibles para ${key} (slotsPerDay=${slotsPerDay})`);

            const response = await api.get(`/cita/cupos-disponibles?date=${key}&slotsPerDay=${slotsPerDay}`);
            const data = response.data;

            // Normalizar posibles formas de respuesta
            // Esperado: { Fecha, TotalCupos, CitasConfirmadas, CuposDisponibles } o camelCase o nombres alternativos
            const fecha = data?.Fecha ?? data?.fecha ?? data?.date ?? key;
            const total = Number(data?.TotalCupos ?? data?.totalCupos ?? data?.total ?? slotsPerDay);
            const confirmed = Number(data?.CitasConfirmadas ?? data?.citasConfirmadas ?? data?.confirmed ?? 0);
            const available = Number(data?.CuposDisponibles ?? data?.cuposDisponibles ?? data?.availableSlots ?? data?.available ?? Math.max(0, total - confirmed));

            const result = {
                date: fecha,
                totalCupos: total,
                citasConfirmadas: confirmed,
                cuposDisponibles: available
            };

            console.log('✅ cupos disponibles result:', result);
            return result;
        } catch (err) {
            console.error('❌ Error en getAvailableSlots:', err);
            throw err.response?.data || err;
        }
    },

    /* ---------- MÉTODOS CRUD (usar datetimeLocalToUTC antes de enviar) ---------- */
    create: async (citaData) => {
        try {
            if (!citaData.idUsuario || !citaData.idPaciente || !citaData.idDoctor || !citaData.fechaHora) {
                throw new Error('Todos los campos son requeridos (Usuario, Paciente, Doctor, Fecha y Hora)');
            }

            // Convierte el valor del input datetime-local (local) a ISO UTC
            const fechaHoraUTC = datetimeLocalToUTC(citaData.fechaHora);

            const payload = {
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHoraUTC,
                estado: citaData.estado ? 1 : 0
            };

            const response = await api.post('/cita/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // invalidar caches
            const keyMonth = fechaHoraUTC.slice(0, 7);
            const keyDay = fechaHoraUTC.slice(0, 10);
            delete citaService._monthCache[keyMonth];
            delete citaService._dayCache[keyDay];
            delete citaService._countsCache[keyMonth];

            await Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Cita creada correctamente', timer: 1400, showConfirmButton: false });

            return response.data;
        } catch (error) {
            console.error('❌ ERROR en service CREATE:', error);
            let errorMessage = 'Error al crear la cita';
            if (error.response?.data) {
                const apiData = error.response.data;
                const msgs = extractValidationMessages(apiData);
                errorMessage = msgs.length ? msgs.join('\n') : (apiData?.message || errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
            }
            await Swal.fire({ icon: 'error', title: 'Error al crear cita', text: errorMessage, width: 600 });
            throw error;
        }
    },

    update: async (id, citaData) => {
        try {
            if (!citaData.fechaHora) {
                throw new Error('La fecha y hora son requeridas');
            }

            const fechaHoraUTC = datetimeLocalToUTC(citaData.fechaHora);

            const payload = {
                idCita: parseInt(id),
                idUsuario: parseInt(citaData.idUsuario),
                idPaciente: parseInt(citaData.idPaciente),
                idDoctor: parseInt(citaData.idDoctor),
                fechaHora: fechaHoraUTC,
                estado: citaData.estado ? 1 : 0
            };

            const response = await api.put(`/cita/update/${id}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            // invalidar caches
            const keyMonth = fechaHoraUTC.slice(0, 7);
            const keyDay = fechaHoraUTC.slice(0, 10);
            delete citaService._monthCache[keyMonth];
            delete citaService._dayCache[keyDay];
            delete citaService._countsCache[keyMonth];

            await Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Cita actualizada correctamente', timer: 1200, showConfirmButton: false });

            return response.data;
        } catch (error) {
            console.error(`❌ Error en UPDATE ${id}:`, error);
            let errorMessage = 'Error al actualizar la cita';
            if (error.response?.data) {
                const apiData = error.response.data;
                const msgs = extractValidationMessages(apiData);
                errorMessage = msgs.length ? msgs.join('\n') : (apiData?.message || errorMessage);
            }
            await Swal.fire({ icon: 'error', title: 'Error al actualizar cita', text: errorMessage });
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/cita/delete/${id}`);
            citaService._monthCache = {};
            citaService._dayCache = {};
            citaService._countsCache = {};
            await Swal.fire({ icon: 'success', title: 'Eliminado', text: 'La cita fue eliminada correctamente', timer: 1200, showConfirmButton: false });
            return response.data;
        } catch (error) {
            console.error(`❌ Error en service DELETE ${id}:`, error);
            const apiData = error.response?.data;
            await Swal.fire({ icon: 'error', title: 'Error al eliminar cita', text: apiData?.message || 'No se pudo eliminar la cita' });
            throw apiData || new Error('Error al eliminar cita');
        }
    },

    /* ---------- MÉTODOS AUXILIARES ---------- */
    isoToDatetimeLocalInput,
    clearCaches: () => {
        citaService._monthCache = {};
        citaService._dayCache = {};
        citaService._countsCache = {};
        console.log('Caches limpiadas.');
    }
};

export default citaService;