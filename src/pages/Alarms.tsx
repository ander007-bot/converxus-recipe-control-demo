import { BellRing, Check } from 'lucide-react';
import { usePlant, type AlarmPriority, type AlarmStatus } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PRIORITY_STYLE: Record<AlarmPriority, string> = {
  Alta: 'bg-red-100 text-red-700 border-red-200',
  Media: 'bg-amber-100 text-amber-700 border-amber-200',
  Baja: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_STYLE: Record<AlarmStatus, string> = {
  Activa: 'bg-red-100 text-red-700 border-red-200',
  Reconocida: 'bg-amber-100 text-amber-700 border-amber-200',
  Cerrada: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function Alarms() {
  const { alarms, acknowledgeAlarm } = usePlant();
  const { userEmail } = useAuth();
  const { notify } = useToast();

  const active = alarms.filter((a) => a.status === 'Activa').length;

  const handleAck = (code: string) => {
    acknowledgeAlarm(code, userEmail ?? 'comercial@converxus.com');
    notify(`Alarma ${code} reconocida por ${userEmail}`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Gestión de alarmas</h2>
          <p className="text-sm text-slate-500">
            Registro de eventos del sistema con priorización y reconocimiento por
            usuario
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${
            active > 0
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <BellRing className="h-4 w-4" />
          {active} alarma{active === 1 ? '' : 's'} activa{active === 1 ? '' : 's'}
        </span>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha/hora</th>
                <th>Equipo</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Reconocida por</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => (
                <tr key={alarm.code}>
                  <td className="font-mono text-xs font-semibold">{alarm.code}</td>
                  <td className="whitespace-nowrap font-mono text-xs">
                    {alarm.timestamp}
                  </td>
                  <td className="whitespace-nowrap font-medium">{alarm.equipment}</td>
                  <td className="max-w-80">{alarm.description}</td>
                  <td>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[alarm.priority]}`}
                    >
                      {alarm.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[alarm.status]}`}
                    >
                      {alarm.status}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">{alarm.ackBy ?? '—'}</td>
                  <td>
                    {alarm.status === 'Activa' ? (
                      <button
                        className="btn-primary !px-2.5 !py-1 text-xs"
                        onClick={() => handleAck(alarm.code)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Reconocer
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card px-4 py-3 text-sm text-slate-500">
        Las alarmas se generan por condiciones de proceso (niveles, caudales, tiempos,
        confirmación de válvulas y comunicación con PLC). En la plataforma completa se
        notifican también por correo y panel de operación.
      </div>
    </div>
  );
}
