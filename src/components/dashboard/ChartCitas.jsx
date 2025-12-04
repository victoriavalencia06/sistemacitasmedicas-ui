import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts";
import citaService from "../../services/citaService";
import { subMonths, eachMonthOfInterval, format } from "date-fns";
import '../../assets/styles/Charts.css'

export default function ChartCitas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState(6);
    const [stats, setStats] = useState({ total: 0, promedio: 0, max: 0 });

    const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const fullMonthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const endDate = new Date();
                const startDate = subMonths(endDate, timeRange);

                const months = eachMonthOfInterval({
                    start: startDate,
                    end: endDate
                });

                const monthlyPromises = months.map(async (date) => {
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const monthIndex = date.getMonth();

                    try {
                        const appointments = await citaService.getByMonth(year, month);
                        const count = Array.isArray(appointments) ? appointments.length : 0;

                        return {
                            mes: monthNames[monthIndex],
                            mesCompleto: `${fullMonthNames[monthIndex]} ${year}`,
                            fecha: format(date, 'yyyy-MM'),
                            citas: count,
                            año: year,
                            mesNumero: month
                        };
                    } catch (err) {
                        console.warn(`Error obteniendo datos para ${year}-${month}:`, err);
                        return {
                            mes: monthNames[monthIndex],
                            mesCompleto: `${fullMonthNames[monthIndex]} ${year}`,
                            fecha: format(date, 'yyyy-MM'),
                            citas: 0,
                            año: year,
                            mesNumero: month
                        };
                    }
                });

                const results = await Promise.all(monthlyPromises);
                const sortedResults = results.sort((a, b) => a.fecha.localeCompare(b.fecha));
                setData(sortedResults);

                // Calcular estadísticas
                const citasArray = sortedResults.map(item => item.citas);
                const total = citasArray.reduce((sum, num) => sum + num, 0);
                const promedio = citasArray.length > 0 ? Math.round(total / citasArray.length) : 0;
                const max = Math.max(...citasArray);

                setStats({ total, promedio, max });
                setError(null);
            } catch (err) {
                console.error("Error cargando datos mensuales:", err);
                setError("No se pudieron cargar los datos mensuales");

                // Datos de ejemplo
                const exampleData = Array.from({ length: timeRange }, (_, i) => {
                    const date = subMonths(new Date(), timeRange - i - 1);
                    const monthIndex = date.getMonth();
                    const year = date.getFullYear();
                    const citas = Math.floor(Math.random() * 20) + 10;

                    return {
                        mes: monthNames[monthIndex],
                        mesCompleto: `${fullMonthNames[monthIndex]} ${year}`,
                        fecha: format(date, 'yyyy-MM'),
                        citas: citas,
                        año: year,
                        mesNumero: monthIndex + 1
                    };
                });

                setData(exampleData);

                const citasArray = exampleData.map(item => item.citas);
                const total = citasArray.reduce((sum, num) => sum + num, 0);
                const promedio = Math.round(total / citasArray.length);
                const max = Math.max(...citasArray);
                setStats({ total, promedio, max });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{dataPoint.mesCompleto}</p>
                    <p className="tooltip-value">
                        Citas: <strong>{payload[0].value}</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

    const TimeRangeButtons = () => (
        <div className="time-range-buttons">
            {[3, 6, 12].map((months) => (
                <button
                    key={months}
                    onClick={() => setTimeRange(months)}
                    className={`time-range-btn ${timeRange === months ? 'active' : ''}`}
                >
                    {months} meses
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">
                    <span className="chart-title-icon">📈</span>
                    Citas por Mes
                </h3>
                <div className="loading-container">
                    <div>
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Cargando datos mensuales...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-card">
            <div className="chart-controls">
                <h3 className="chart-title">
                    <span className="chart-title-icon">📈</span>
                    Citas por Mes
                </h3>
                <TimeRangeButtons />
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {data.length === 0 ? (
                <div className="no-data-message">
                    <p>No hay datos de citas para el período seleccionado</p>
                </div>
            ) : (
                <>
                    <div className="chart-wrapper">
                        <ResponsiveContainer>
                            <LineChart
                                data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="mes"
                                    axisLine={{ stroke: "#ddd" }}
                                    tickLine={{ stroke: "#ddd" }}
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis
                                    axisLine={{ stroke: "#ddd" }}
                                    tickLine={{ stroke: "#ddd" }}
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    width={40}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="citas"
                                    name="Total de Citas"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    dot={{
                                        stroke: "#8884d8",
                                        strokeWidth: 2,
                                        r: 4,
                                        fill: "white"
                                    }}
                                    activeDot={{
                                        r: 6,
                                        stroke: "#8884d8",
                                        strokeWidth: 2,
                                        fill: "white"
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-summary">
                        <div className="chart-summary-item">
                            <span className="summary-value">{stats.total}</span>
                            <span className="summary-label">Total Citas</span>
                        </div>
                        <div className="chart-summary-item">
                            <span className="summary-value">{stats.promedio}</span>
                            <span className="summary-label">Promedio</span>
                        </div>
                        <div className="chart-summary-item">
                            <span className="summary-value">{stats.max}</span>
                            <span className="summary-label">Máximo</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}