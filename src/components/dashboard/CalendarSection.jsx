import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes, FaUser, FaStethoscope, FaClock } from 'react-icons/fa';
import citaService from '../../services/citaService';
import '../../assets/styles/Management.css';

const CalendarSection = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [counts, setCounts] = useState({});
    const [dayDetails, setDayDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingCounts, setLoadingCounts] = useState(false);
    const [loadingDay, setLoadingDay] = useState(false);
    const [error, setError] = useState(null);

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const pad = (n) => String(n).padStart(2, '0');
    const dayKeyFromParts = (y, m, day) => `${y}-${pad(m)}-${pad(day)}`;
    const dayKeyFromDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const loadCounts = async () => {
            setLoadingCounts(true);
            setError(null);
            try {
                const result = await citaService.getCountsByMonth(year, month);
                setCounts(result || {});
            } catch (err) {
                console.error('Error al cargar counts:', err);
                setError('No fue posible cargar las citas del mes');
                setCounts({});
            } finally {
                setLoadingCounts(false);
            }
        };

        loadCounts();
    }, [currentDate]);

    const generateCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();

            const key = dayKeyFromParts(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
            const appointmentsCount = counts[key] || 0;

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday,
                isSelected,
                appointmentsCount
            });
        }

        return days;
    };

    const handleDateSelect = async (dayObj) => {
        if (!dayObj || !dayObj.isCurrentMonth) return;
        const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day);
        setSelectedDate(newSelected);

        const key = dayKeyFromDate(newSelected);
        setLoadingDay(true);
        setError(null);

        try {
            const appointments = await citaService.getByDay(key);
            setDayDetails(appointments || []);
            setShowModal(true);
        } catch (err) {
            console.error('Error al obtener citas del día:', err);
            setDayDetails([]);
            setError('No fue posible cargar las citas del día');
        } finally {
            setLoadingDay(false);
        }
    };

    const calendarDays = generateCalendar();
    const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    // Calcular total de citas del mes
    const totalCitas = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="management-table-container">
            {/* Header al estilo management */}
            <div className="management-table-header">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <h2 className="management-table-title mb-1">
                            <FaCalendarAlt className="me-2" />
                            Calendario de Citas
                        </h2>
                        <p className="management-table-subtitle mb-0">
                            {totalCitas} {totalCitas === 1 ? 'cita programada este mes' : 'citas programadas este mes'}
                        </p>
                    </div>
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => navigateMonth(-1)}
                        >
                            <FaChevronLeft size={14} />
                        </button>
                        <span className="text-white fw-bold mx-2">{monthName}</span>
                        <button
                            className="btn btn-sm btn-outline-light ms-2"
                            onClick={() => navigateMonth(1)}
                        >
                            <FaChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body p-3">
                <div className="row week-days mb-2 text-center">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="col p-1 fw-bold text-muted small">
                            {day}
                        </div>
                    ))}
                </div>

                {loadingCounts && (
                    <div className="text-center py-2">
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                        <small className="text-muted ms-2">Cargando citas...</small>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center py-2 small mb-2">
                        {error}
                    </div>
                )}

                <div className="calendar-horizontal">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day-horizontal text-center ${!day.isCurrentMonth ? 'text-muted' : ''} ${day.isToday ? 'calendar-today-horizontal' : ''} ${day.isSelected ? 'calendar-selected-horizontal' : ''} ${day.appointmentsCount > 0 ? 'calendar-busy-horizontal' : ''}`}
                            onClick={() => handleDateSelect(day)}
                        >
                            <div className="day-number-horizontal">{day.day || ''}</div>
                            {day.appointmentsCount > 0 && day.isCurrentMonth && (
                                <div className="busy-dot-horizontal"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-2 pt-2 border-top">
                    <div className="row text-center small">
                        <div className="col-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="legend-dot-horizontal today-dot me-1"></div>
                                <span className="text-muted">Hoy</span>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="legend-dot-horizontal busy-dot me-1"></div>
                                <span className="text-muted">Citas</span>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="legend-dot-horizontal selected-dot me-1"></div>
                                <span className="text-muted">Sel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-normal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-normal">
                        <div className="modal-normal-header">
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-primary" />
                                <div>
                                    <h6 className="mb-0 fw-bold">Citas del Día</h6>
                                    <small className="text-muted">
                                        {selectedDate.toLocaleDateString('es-ES', {
                                            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </small>
                                </div>
                            </div>
                            <button className="btn-close-transparent" onClick={() => setShowModal(false)}>
                                <FaTimes size={14} />
                            </button>
                        </div>

                        <div className="modal-normal-body">
                            {loadingDay ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                    <p className="text-muted mt-2 mb-0 small">Cargando citas...</p>
                                </div>
                            ) : dayDetails.length === 0 ? (
                                <div className="text-center py-3">
                                    <FaCalendarAlt className="text-muted mb-2" size={24} />
                                    <p className="text-muted mb-0 small">No hay citas programadas</p>
                                </div>
                            ) : (
                                <div>
                                    {dayDetails.map((appt, index) => (
                                        <div key={appt.idCita ?? index} className="cita-item-normal">
                                            <div className="cita-time-normal">
                                                {new Date(appt.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="cita-info-normal">
                                                <div className="cita-paciente-normal">{appt.paciente}</div>
                                                <div className="cita-doctor-normal">{appt.doctor}</div>
                                            </div>
                                            <div className={`cita-status-normal ${appt.estado ? 'text-success' : 'text-danger'}`}>
                                                {appt.estado ? 'Activa' : 'Inactiva'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-normal-footer">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>
                                <FaTimes className="me-1" size={12} /> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarSection;