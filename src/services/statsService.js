import citaService from './citaService';
import pacienteService from './pacienteService';

// slotsPerDay por defecto
const DEFAULT_SLOTS_PER_DAY = 20;

const statsService = {
    // Retorna: { totalPatients, todayAppointments, availableSlots, consultationsThisMonth, loading?, error? }
    getOverview: async ({ date = new Date(), slotsPerDay = DEFAULT_SLOTS_PER_DAY } = {}) => {
        try {
            const targetDate = date instanceof Date ? date : new Date(date);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;

            // Paralelizar llamadas
            const [
                totalPatientsResult,
                dayAppointments,
                monthAppointments,
                slotsResult
            ] = await Promise.all([
                pacienteService.getTotalPatients(),
                citaService.getByDay(targetDate),          // array de citas del día
                citaService.getByMonth(year, month),       // array de citas del mes
                citaService.getAvailableSlots(targetDate, slotsPerDay)
            ]);

            const totalPatients = Number(totalPatientsResult || 0);
            const todayAppointments = Array.isArray(dayAppointments) ? dayAppointments.length : (dayAppointments?.appointments?.length ?? 0);
            const consultationsThisMonth = Array.isArray(monthAppointments) ? monthAppointments.length : (monthAppointments?.appointments?.length ?? 0);

            const availableSlots =
                slotsResult?.cuposDisponibles ??
                slotsResult?.CuposDisponibles ??
                slotsResult?.availableSlots ??
                slotsResult?.available ??
                0;

            const available = Number(availableSlots);


            return {
                totalPatients,
                todayAppointments,
                availableSlots: Number(available),
                consultationsThisMonth
            };
        } catch (err) {
            console.error('Error en statsService.getOverview:', err);
            throw err;
        }
    }
};

export default statsService;
