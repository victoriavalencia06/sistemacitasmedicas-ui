// ChartEspecializacionPie.jsx
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import especializacionService from "../../services/especializacionService";
import '../../assets/styles/Charts.css';

export default function ChartEspecializacionPie() {

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalEspecializaciones: 0,
    mayorCantidad: 0
  });
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
    "#0088FE", "#00C49N", "#FFBB28", "#8dd1e1",
    "#a4de6c", "#d0ed57", "#e86e6e"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await especializacionService.getDoctoresPorEspecializacion();

        if (!res || !Array.isArray(res)) {
          setData([]);
          return;
        }

        const normalized = res.map(item => ({
          name: item.especializacionNombre,
          value: Number(item.cantidadDoctores)
        }));

        const valid = normalized.filter(x => x.value && x.value > 0);

        const max = valid.length ? Math.max(...valid.map(x => x.value)) : 0;

        setStats({
          totalEspecializaciones: valid.length,
          mayorCantidad: max
        });

        setData(valid);
      } catch (err) {
        console.log("Error PieChart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">
          <span className="chart-title-icon">🎯</span>
          Especializaciones
        </h3>
        <div className="loading-container">
          <div>
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">
        <span className="chart-title-icon">🎯</span>
        Doctores por Especialización
      </h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name }) => name}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔵 Resumen inferior como en Citas */}
      <div className="chart-summary">
        <div className="chart-summary-item">
          <span className="summary-value">{stats.totalEspecializaciones}</span>
          <span className="summary-label">Especializaciones</span>
        </div>

        <div className="chart-summary-item">
          <span className="summary-value">{stats.mayorCantidad}</span>
          <span className="summary-label">Máximo Doctores</span>
        </div>
      </div>
    </div>
  );
}
