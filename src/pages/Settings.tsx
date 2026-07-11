import type { ReactNode } from 'react';
import {
  Database,
  FlaskConical,
  Radio,
  Waypoints,
  Users,
  BellRing,
  Cpu,
  Cloud,
} from 'lucide-react';
import { RECIPES, OPERATORS } from '../data/recipes';
import { usePlant } from '../context/PlantContext';
import { formatLiters } from '../utils/format';

export default function SettingsPage() {
  const { tanks } = usePlant();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Configuración del sistema</h2>
        <p className="text-sm text-slate-500">
          Parámetros de planta, equipos e integración — Sistema escalable a más tanques,
          más recetas y más líneas
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tanques */}
        <Section icon={<Database className="h-4 w-4" />} title="Tanques">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Tanque</th>
                <th>Capacidad</th>
                <th>Válvula</th>
                <th>Sensor</th>
                <th>Modo</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((t) => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.id}</td>
                  <td>{formatLiters(t.capacity)}</td>
                  <td>{t.valve}</td>
                  <td>{t.sensor}</td>
                  <td className="text-xs">
                    {t.mode === 'auto' ? 'Automático' : 'Manual'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Recetas */}
        <Section icon={<FlaskConical className="h-4 w-4" />} title="Recetas">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Código</th>
                <th>Receta</th>
                <th>Volumen</th>
                <th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {RECIPES.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs">{r.id}</td>
                  <td className="font-medium">{r.name}</td>
                  <td>{formatLiters(r.liters)}</td>
                  <td>{r.minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Sensores */}
        <Section icon={<Radio className="h-4 w-4" />} title="Sensores">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Tipo</th>
                <th>Rango</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tag: 'LT-01', tipo: 'Nivel radar', rango: '0 – 1.000 L' },
                { tag: 'LT-02', tipo: 'Nivel radar', rango: '0 – 1.500 L' },
                { tag: 'LT-03', tipo: 'Nivel radar', rango: '0 – 2.000 L' },
                { tag: 'LT-04', tipo: 'Nivel ultrasónico', rango: '0 – 800 L' },
                { tag: 'FT-01', tipo: 'Caudalímetro electromagnético', rango: '0 – 120 L/min' },
              ].map((s) => (
                <tr key={s.tag}>
                  <td className="font-mono text-xs font-semibold">{s.tag}</td>
                  <td>{s.tipo}</td>
                  <td className="text-xs">{s.rango}</td>
                  <td>
                    <OkBadge />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Válvulas */}
        <Section icon={<Waypoints className="h-4 w-4" />} title="Válvulas automáticas">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Tipo</th>
                <th>Destino</th>
                <th>Confirmación</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((t) => (
                <tr key={t.valve}>
                  <td className="font-mono text-xs font-semibold">{t.valve}</td>
                  <td>Válvula neumática on/off</td>
                  <td>{t.id}</td>
                  <td className="text-xs">Final de carrera</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Operadores */}
        <Section icon={<Users className="h-4 w-4" />} title="Operadores">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Permisos</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: OPERATORS[0], rol: 'Operación', permisos: 'Iniciar / pausar recetas' },
                { user: OPERATORS[1], rol: 'Operación', permisos: 'Iniciar / pausar recetas' },
                { user: OPERATORS[2], rol: 'Supervisión', permisos: 'Recetas + alarmas + reportes' },
                { user: OPERATORS[3], rol: 'Calidad', permisos: 'Trazabilidad + reportes' },
              ].map((o) => (
                <tr key={o.user}>
                  <td className="font-medium">{o.user}</td>
                  <td>{o.rol}</td>
                  <td className="text-xs text-slate-500">{o.permisos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Límites de alarma */}
        <Section icon={<BellRing className="h-4 w-4" />} title="Límites de alarma">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Límite</th>
                <th>Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: 'Nivel alto-alto de tanque', l: '95% de capacidad', pr: 'Alta' },
                { p: 'Confirmación de apertura de válvula', l: '5 s', pr: 'Alta' },
                { p: 'Caudal mínimo con válvula abierta', l: '5 L/min', pr: 'Alta' },
                { p: 'Tiempo máximo de llenado', l: '+25% del estimado', pr: 'Media' },
                { p: 'Diferencia programado vs real', l: '±1,5%', pr: 'Baja' },
              ].map((row) => (
                <tr key={row.p}>
                  <td>{row.p}</td>
                  <td className="font-mono text-xs">{row.l}</td>
                  <td className="text-xs">{row.pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Integración PLC/HMI */}
        <Section icon={<Cpu className="h-4 w-4" />} title="Integración PLC / HMI">
          <dl className="space-y-2 p-4 text-sm">
            <Item k="PLC principal" v="Siemens / Industrial PLC compatible" />
            <Item k="Protocolo" v="Modbus TCP / Profinet / MQTT Gateway" />
            <Item k="HMI local" v="Disponible" ok />
            <Item k="Frecuencia de actualización" v="2 segundos" />
            <Item k="Entradas integradas" v="Sensores de nivel, caudalímetros, confirmación de válvulas" />
            <Item k="Salidas integradas" v="Válvulas automáticas, agitadores, señales de paro" />
          </dl>
        </Section>

        {/* Cloud */}
        <Section icon={<Cloud className="h-4 w-4" />} title="Conexión Converxus Cloud">
          <dl className="space-y-2 p-4 text-sm">
            <Item k="Gateway cloud" v="Activo" ok />
            <Item k="Sincronización de históricos" v="Cada 5 minutos" />
            <Item k="Acceso remoto" v="Panel web y notificaciones" />
            <Item k="Modo de operación" v="Demo comercial" />
            <Item
              k="Nota"
              v="Vista previa comercial — esta demo no está conectada a equipos reales"
            />
          </dl>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title flex items-center gap-2">
          <span className="text-brand-600">{icon}</span>
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Item({ k, v, ok = false }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs text-slate-400">{k}</dt>
      <dd
        className={`text-right font-medium ${ok ? 'text-emerald-600' : 'text-slate-700'}`}
      >
        {ok && '● '}
        {v}
      </dd>
    </div>
  );
}

function OkBadge() {
  return (
    <span className="inline-block rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      OK
    </span>
  );
}
