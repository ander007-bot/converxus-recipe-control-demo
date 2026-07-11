import type { ReactNode } from 'react';
import {
  Droplets,
  CalendarRange,
  CalendarDays,
  ListChecks,
  FlaskConical,
  Database,
  BellRing,
  Target,
  Timer,
  Scale,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { usePlant } from '../context/PlantContext';
import { formatLiters } from '../utils/format';

const CONSUMO_DIARIO = [
  { dia: 'Lun', litros: 7920 },
  { dia: 'Mar', litros: 8340 },
  { dia: 'Mié', litros: 7610 },
  { dia: 'Jue', litros: 8890 },
  { dia: 'Vie', litros: 9120 },
  { dia: 'Sáb', litros: 5480 },
  { dia: 'Dom', litros: 3150 },
];

const PREP_POR_RECETA = [
  { receta: 'Desinfectante A', cantidad: 24 },
  { receta: 'Detergente B', cantidad: 19 },
  { receta: 'Limpiador C', cantidad: 14 },
  { receta: 'Enjuague CIP', cantidad: 31 },
  { receta: 'Sanitizante D', cantidad: 11 },
  { receta: 'Base E', cantidad: 8 },
];

const USO_POR_TANQUE = [
  { tanque: 'TQ-01', horas: 128 },
  { tanque: 'TQ-02', horas: 143 },
  { tanque: 'TQ-03', horas: 96 },
  { tanque: 'TQ-04', horas: 74 },
];

const ALARMAS_POR_TIPO = [
  { tipo: 'Nivel', cantidad: 9 },
  { tipo: 'Válvula', cantidad: 6 },
  { tipo: 'Caudal', cantidad: 7 },
  { tipo: 'Tiempo', cantidad: 4 },
  { tipo: 'Sensor', cantidad: 5 },
  { tipo: 'Comunicación', cantidad: 3 },
];

const PROG_VS_REAL = [
  { lote: 'L-001', programado: 500, real: 498.7 },
  { lote: 'L-002', programado: 750, real: 752.1 },
  { lote: 'L-003', programado: 1000, real: 997.8 },
  { lote: 'L-005', programado: 1250, real: 1247.5 },
  { lote: 'L-096', programado: 750, real: 748.9 },
  { lote: 'L-097', programado: 500, real: 501.2 },
  { lote: 'L-098', programado: 300, real: 299.4 },
];

const PRECISION_POR_LOTE = [
  { lote: 'L-001', precision: 99.7 },
  { lote: 'L-002', precision: 99.7 },
  { lote: 'L-003', precision: 99.8 },
  { lote: 'L-005', precision: 99.8 },
  { lote: 'L-096', precision: 99.9 },
  { lote: 'L-097', precision: 99.8 },
  { lote: 'L-098', precision: 99.8 },
];

const TANK_COLORS = ['#0e7ac4', '#0ea5e9', '#14b8a6', '#64748b'];

export default function Reports() {
  const { kpis } = usePlant();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Reportes gerenciales</h2>
        <p className="text-sm text-slate-500">
          Reportes para producción, calidad y gerencia — Datos simulados de la última
          semana
        </p>
      </div>

      {/* KPIs ejecutivos */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          icon={Droplets}
          label="Consumo diario"
          value={formatLiters(kpis.consumptionToday)}
          tone="info"
        />
        <KpiCard icon={CalendarRange} label="Consumo semanal" value="50.510 L" tone="info" />
        <KpiCard icon={CalendarDays} label="Consumo mensual" value="208.340 L" tone="info" />
        <KpiCard
          icon={ListChecks}
          label="Preparaciones"
          value="107"
          detail="Última semana"
          tone="success"
        />
        <KpiCard
          icon={FlaskConical}
          label="Receta más ejecutada"
          value="Enjuague CIP"
          detail="31 preparaciones"
          tone="default"
        />
        <KpiCard
          icon={Database}
          label="Tanque con mayor uso"
          value="TQ-02"
          detail="143 h de operación"
          tone="default"
        />
        <KpiCard icon={BellRing} label="Alarmas del día" value="3" tone="warning" />
        <KpiCard
          icon={Target}
          label="Precisión promedio"
          value="98,7%"
          detail="Dosificación"
          tone="success"
        />
        <KpiCard
          icon={Timer}
          label="Tiempo promedio"
          value="14,8 min"
          detail="Por preparación"
          tone="default"
        />
        <KpiCard
          icon={Scale}
          label="Diferencia promedio"
          value="±1,6 L"
          detail="Programado vs real"
          tone="success"
        />
      </div>

      {/* Gráficas */}
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Consumo de líquido por día (L)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CONSUMO_DIARIO}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={50} />
              <Tooltip />
              <Bar dataKey="litros" name="Litros" fill="#0e7ac4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Preparaciones por receta">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={PREP_POR_RECETA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="receta"
                tick={{ fontSize: 11 }}
                width={110}
              />
              <Tooltip />
              <Bar
                dataKey="cantidad"
                name="Preparaciones"
                fill="#14b8a6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Uso por tanque (horas de operación)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={USO_POR_TANQUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tanque" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Bar dataKey="horas" name="Horas" radius={[4, 4, 0, 0]}>
                {USO_POR_TANQUE.map((entry, i) => (
                  <Cell key={entry.tanque} fill={TANK_COLORS[i % TANK_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alarmas por tipo (últimos 30 días)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ALARMAS_POR_TIPO}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Alarmas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Litros programados vs litros reales por lote">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={PROG_VS_REAL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="lote" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={50} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="programado"
                name="Programado (L)"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="real" name="Real (L)" fill="#0e7ac4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Precisión de dosificación por lote (%)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PRECISION_POR_LOTE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="lote" tick={{ fontSize: 11 }} />
              <YAxis domain={[99, 100]} tick={{ fontSize: 11 }} width={45} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="precision"
                name="Precisión %"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
