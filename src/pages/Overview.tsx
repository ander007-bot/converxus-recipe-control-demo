import {
  Droplets,
  FlaskConical,
  ListChecks,
  BellRing,
  Target,
  Activity,
} from 'lucide-react';
import { usePlant } from '../context/PlantContext';
import KpiCard from '../components/KpiCard';
import Mimic from '../components/Mimic';
import StatusBadge from '../components/StatusBadge';
import { formatLiters, formatNumber, formatPercent } from '../utils/format';

export default function Overview() {
  const { tanks, alarms, kpis } = usePlant();
  const activeAlarms = alarms.filter((a) => a.status === 'Activa').length;

  return (
    <div className="space-y-4">
      {/* KPIs superiores */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          icon={Droplets}
          label="Consumo hoy"
          value={formatLiters(kpis.consumptionToday)}
          tone="info"
        />
        <KpiCard
          icon={ListChecks}
          label="Preparaciones hoy"
          value={String(kpis.preparationsToday)}
          tone="success"
        />
        <KpiCard
          icon={FlaskConical}
          label="Recetas activas"
          value={String(kpis.activeRecipes)}
          tone="default"
        />
        <KpiCard
          icon={BellRing}
          label="Alarmas activas"
          value={String(activeAlarms)}
          tone={activeAlarms > 0 ? 'danger' : 'success'}
        />
        <KpiCard
          icon={Target}
          label="Precisión promedio"
          value={formatPercent(kpis.avgPrecision)}
          detail="Dosificación"
          tone="success"
        />
        <KpiCard
          icon={Activity}
          label="Estado general"
          value="Operativo"
          tone="success"
        />
      </div>

      {/* Mímico industrial */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Mímico de proceso — Preparación por recetas</h2>
            <p className="text-xs text-slate-400">
              Fuente tratada → Tanque pulmón → Manifold → Válvulas automáticas → Tanques
              de preparación
            </p>
          </div>
          <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 md:inline">
            Actualización cada 2 s
          </span>
        </div>
        <div className="p-3">
          <Mimic />
        </div>
      </div>

      {/* Resumen operativo de tanques */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Resumen operativo por tanque</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Tanque</th>
                <th>Estado</th>
                <th>Receta activa</th>
                <th>Lote</th>
                <th>Programado</th>
                <th>Cargado</th>
                <th>Avance</th>
                <th>Caudal</th>
                <th>Válvula</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((tank) => {
                const progress =
                  tank.programmed > 0
                    ? Math.min(100, (tank.loaded / tank.programmed) * 100)
                    : 0;
                return (
                  <tr key={tank.id}>
                    <td className="font-semibold">{tank.id}</td>
                    <td>
                      <StatusBadge status={tank.status} />
                    </td>
                    <td>{tank.recipe ?? '—'}</td>
                    <td className="font-mono text-xs">{tank.batch ?? '—'}</td>
                    <td>{tank.programmed > 0 ? formatLiters(tank.programmed) : '—'}</td>
                    <td>
                      {tank.programmed > 0 ? formatLiters(tank.loaded, 1) : '—'}
                    </td>
                    <td className="min-w-28">
                      {tank.programmed > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-sky-500 transition-all duration-700"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {tank.flow > 0 ? `${formatNumber(tank.flow, 1)} L/min` : '—'}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold ${
                          tank.valveOpen ? 'text-sky-600' : 'text-slate-500'
                        }`}
                      >
                        {tank.valve} · {tank.valveOpen ? 'Abierta' : 'Cerrada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Propuesta de valor */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          'Preparación más segura, repetible y documentada',
          'Control automático de llenado por receta',
          'Trazabilidad por lote, tanque, receta y operador',
        ].map((text) => (
          <div
            key={text}
            className="card px-4 py-3 text-sm font-medium text-slate-600"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
