import { Link } from 'react-router-dom';
import { ArrowRight, Gauge } from 'lucide-react';
import { usePlant } from '../context/PlantContext';
import StatusBadge from '../components/StatusBadge';
import TankLevel from '../components/TankLevel';
import { formatLiters, formatNumber } from '../utils/format';

export default function Tanks() {
  const { tanks } = usePlant();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Tanques de preparación</h2>
        <p className="text-sm text-slate-500">
          Estado en tiempo real de los tanques, válvulas y sensores asociados
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {tanks.map((tank) => {
          const levelPct = (tank.volume / tank.capacity) * 100;
          const diff = tank.programmed > 0 ? tank.loaded - tank.programmed : null;
          return (
            <div key={tank.id} className="card flex flex-col">
              <div className="card-header">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{tank.id}</h3>
                  <p className="text-xs text-slate-400">
                    Capacidad {formatLiters(tank.capacity)}
                  </p>
                </div>
                <StatusBadge status={tank.status} />
              </div>

              <div className="flex flex-1 gap-4 p-4">
                <TankLevel percent={levelPct} status={tank.status} />

                <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                  <Row label="Nivel actual" value={`${levelPct.toFixed(1)}%`} />
                  <Row label="Volumen actual" value={formatLiters(tank.volume, 1)} />
                  <Row label="Receta activa" value={tank.recipe ?? '—'} />
                  <Row
                    label="Lote actual"
                    value={tank.batch ?? '—'}
                    mono={tank.batch !== null}
                  />
                  <Row
                    label="Programado"
                    value={tank.programmed > 0 ? formatLiters(tank.programmed) : '—'}
                  />
                  <Row
                    label="Cargado"
                    value={
                      tank.programmed > 0 ? formatLiters(tank.loaded, 1) : '—'
                    }
                  />
                  <Row
                    label="Diferencia"
                    value={
                      diff !== null
                        ? `${diff > 0 ? '+' : ''}${formatNumber(diff, 1)} L`
                        : '—'
                    }
                  />
                  <Row
                    label="Válvula"
                    value={`${tank.valve} · ${tank.valveOpen ? 'Abierta' : 'Cerrada'}`}
                  />
                  <Row label="Sensor" value={tank.sensor} />
                </div>
              </div>

              {tank.flow > 0 && (
                <div className="mx-4 mb-3 flex items-center gap-2 rounded-md bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
                  <Gauge className="h-4 w-4" />
                  Caudal instantáneo: {formatNumber(tank.flow, 1)} L/min
                </div>
              )}

              <div className="border-t border-slate-100 p-3">
                <Link
                  to={`/tanques/${tank.id}`}
                  className="btn-secondary w-full"
                >
                  Ver detalle
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <span
        className={`truncate text-right font-medium text-slate-700 ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
