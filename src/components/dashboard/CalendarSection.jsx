import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CalendarSection = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const generateCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Días del mes anterior
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', isCurrentMonth: false });
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();

            // Simular días ocupados (ejemplo)
            const isBusy = i % 7 === 0 || i % 5 === 0;

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday,
                isSelected,
                isBusy
            });
        }

        return days;
    };

    const handleDateSelect = (day) => {
        if (day && day.isCurrentMonth) {
            setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day));
        }
    };

    const calendarDays = generateCalendar();
    const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-primary" />
                    Calendario
                </h5>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => navigateMonth(-1)}
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="fw-bold">{monthName}</span>
                    <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => navigateMonth(1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="row week-days mb-3 text-center">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="col p-2 fw-bold text-muted">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-grid">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day text-center p-2 ${!day.isCurrentMonth ? 'text-muted' : ''
                                } ${day.isToday ? 'calendar-today' : ''
                                } ${day.isSelected ? 'calendar-selected' : ''
                                } ${day.isBusy ? 'calendar-busy' : ''
                                }`}
                            onClick={() => handleDateSelect(day)}
                        >
                            {day.day || ''}
                            {day.isBusy && day.isCurrentMonth && (
                                <div className="busy-indicator"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-3 pt-3 border-top">
                    <div className="row text-center">
                        <div className="col">
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="legend-busy me-2"></div>
                                <small className="text-muted">Día ocupado</small>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="legend-today me-2"></div>
                                <small className="text-muted">Hoy</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarSection;