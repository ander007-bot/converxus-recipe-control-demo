import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Hand,
  Lock,
  Unlock,
  BellOff,
  Fan,
  Gauge,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usePlant } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import TankLevel from '../components/TankLevel';
import { formatLiters, formatMinutes, formatNumber, formatTime } from '../utils/format';

export default function TankDetail() {
  const { tankId } = useParams<{ tankId: string }>();
  const { tanks, alarms, acknowledgeAlarm, setTankMode, toggleSafetyLock } = usePlant();
  const { userEmail } = useAuth();
  const { notify } = useToast();

  const tank = tanks.find((t) => t.id === tankId);
  if (!tank) {
    return <Navigate to="/tanques" replace />;
  }

  const levelPct = (tank.volume / tank.capacity) * 100;
  const diff = tank.programmed > 0 ? tank.loaded - tank.programmed : null;
  const remainingMin =
    tank.status === 'llenando' && tank.flow > 0
      ? (tank.programmed - tank.loaded) / tank.flow
      : null;

  const tankAlarm = alarms.find(
    (a) => a.status === 'Activa' && a.equipment.includes(tank.id),
  );

  const handleAck = () => {
    if (!tankAlarm) {
      notify('No hay alarmas activas asociadas a este tanque', 'info');
      return;
    }
    acknowledgeAlarm(tankAlarm.code, userEmail ?? 'comercial@converxus.com');
    notify(`Alarma ${tankAlarm.code} reconocida`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">
              Tanque {tank.id} — Detalle operativo
            </h2>
            <StatusBadge status={tank.status} />
          </div>
          <p className="text-sm text-slate-500">
            Monitoreo local y remoto del proceso · Última actualización:{' '}
            {formatTime(new Date())}
          </p>
        </div>
        <Link to="/tanques" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Volver a tanques
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Estado del tanque */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Estado del tanque</h3>
          </div>
          <div className="flex gap-4 p-4">
            <TankLevel percent={levelPct} status={tank.status} />
            <div className="flex-1 space-y-1.5 text-sm">
              <Info label="Capacidad total" value={formatLiters(tank.capacity)} />
              <Info label="Volumen actual" value={formatLiters(tank.volume, 1)} />
              <Info label="Nivel actual" value={`${levelPct.toFixed(1)}%`} />
              <Info label="Receta activa" value={tank.recipe ?? '—'} />
              <Info label="Lote actual" value={tank.batch ?? '—'} />
              <Info label="Operador" value={tank.operator ?? '—'} />
              <Info label="Sensor de nivel" value={tank.sensor} />
            </div>
          </div>
        </div>

        {/* Dosificación */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dosificación — Programado vs real</h3>
          </div>
          <div className="space-y-1.5 p-4 text-sm">
            <Info
              label="Litros programados"
              value={tank.programmed > 0 ? formatLiters(tank.programmed) : '—'}
            />
            <Info
              label="Litros cargados"
              value={tank.programmed > 0 ? formatLiters(tank.loaded, 1) : '—'}
            />
            <Info
              label="Diferencia"
              value={
                diff !== null
                  ? `${diff > 0 ? '+' : ''}${formatNumber(diff, 1)} L`
                  : '—'
              }
            />
            <Info
              label="Caudal instantáneo"
              value={tank.flow > 0 ? `${formatNumber(tank.flow, 1)} L/min` : '0 L/min'}
            />
            <Info
              label="Tiempo transcurrido"
              value={tank.elapsedMin > 0 ? formatMinutes(tank.elapsedMin) : '—'}
            />
            <Info
              label="Tiempo estimado restante"
              value={remainingMin !== null ? formatMinutes(remainingMin) : '—'}
            />
            <div className="pt-2">
              {tank.programmed > 0 && (
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (tank.loaded / tank.programmed) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Equipos asociados */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Equipos y seguridad</h3>
          </div>
          <div className="space-y-1.5 p-4 text-sm">
            <Info
              label="Válvula de entrada"
              value={`${tank.valve} · ${tank.valveOpen ? 'Abierta' : 'Cerrada'}`}
            />
            <Info
              label="Válvula de salida"
              value={tank.outValveOpen ? 'Abierta' : 'Cerrada'}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Agitador</span>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  tank.agitator ? 'text-teal-600' : 'text-slate-500'
                }`}
              >
                <Fan
                  className={`h-4 w-4 ${tank.agitator ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '2.5s' }}
                />
                {tank.agitator ? 'En marcha' : 'Detenido'}
              </span>
            </div>
            <Info
              label="Modo de operación"
              value={tank.mode === 'auto' ? 'Automático' : 'Manual'}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Estado de seguridad</span>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  tank.safetyLock ? 'text-red-600' : 'text-emerald-600'
                }`}
              >
                {tank.safetyLock ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {tank.safetyLock ? 'Bloqueado por seguridad' : 'Normal'}
              </span>
            </div>
            <Info label="Última actualización" value={formatTime(new Date())} />

            <div className="grid grid-cols-2 gap-2 pt-3">
              <button
                className={tank.mode === 'auto' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => {
                  setTankMode(tank.id, 'auto');
                  notify(`${tank.id} en modo automático`, 'info');
                }}
              >
                <Bot className="h-4 w-4" />
                Automático
              </button>
              <button
                className={tank.mode === 'manual' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => {
                  setTankMode(tank.id, 'manual');
                  notify(`${tank.id} en modo manual`, 'info');
                }}
              >
                <Hand className="h-4 w-4" />
                Manual
              </button>
              <button
                className={tank.safetyLock ? 'btn-danger' : 'btn-secondary'}
                onClick={() => {
                  toggleSafetyLock(tank.id);
                  notify(
                    tank.safetyLock
                      ? `Bloqueo de seguridad retirado en ${tank.id}`
                      : `Bloqueo de seguridad aplicado en ${tank.id}`,
                    'warning',
                  );
                }}
              >
                {tank.safetyLock ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {tank.safetyLock ? 'Desbloquear' : 'Bloqueo seguridad'}
              </button>
              <button className="btn-warning" onClick={handleAck}>
                <BellOff className="h-4 w-4" />
                Reconocer alarma
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas de tendencia */}
      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Litros acumulados vs tiempo">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tank.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} minTickGap={40} />
              <YAxis tick={{ fontSize: 10 }} width={45} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cargados"
                name="Litros"
                stroke="#0e7ac4"
                fill="#0e7ac4"
                fillOpacity={0.15}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Caudal L/min vs tiempo">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tank.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} minTickGap={40} />
              <YAxis tick={{ fontSize: 10 }} width={45} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="caudal"
                name="L/min"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Nivel del tanque vs tiempo (%)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tank.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} minTickGap={40} />
              <YAxis tick={{ fontSize: 10 }} width={45} domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="nivel"
                name="Nivel %"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.15}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
        <Gauge className="h-4 w-4 text-brand-600" />
        Integración con PLC, HMI, sensores, válvulas y caudalímetros — Sistema escalable
        a más tanques, más recetas y más líneas
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <span className="truncate text-right font-medium text-slate-700">{value}</span>
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
