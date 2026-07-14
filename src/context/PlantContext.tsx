import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type TankStatus = 'disponible' | 'llenando' | 'preparando' | 'espera' | 'alarma';

export interface SeriesPoint {
  t: string;
  cargados: number;
  caudal: number;
  nivel: number;
}

export interface Tank {
  id: string;
  capacity: number;
  volume: number;
  status: TankStatus;
  recipe: string | null;
  batch: string | null;
  operator: string | null;
  programmed: number;
  loaded: number;
  flow: number;
  valve: string;
  valveOpen: boolean;
  outValveOpen: boolean;
  agitator: boolean;
  sensor: string;
  elapsedMin: number;
  estimatedMin: number;
  mode: 'auto' | 'manual';
  safetyLock: boolean;
  series: SeriesPoint[];
  prepTicks: number;
  autoCycle: boolean;
}

export type AlarmPriority = 'Alta' | 'Media' | 'Baja';
export type AlarmStatus = 'Activa' | 'Reconocida' | 'Cerrada';

export interface Alarm {
  code: string;
  timestamp: string;
  equipment: string;
  description: string;
  priority: AlarmPriority;
  status: AlarmStatus;
  ackBy: string | null;
}

export interface PlantKpis {
  consumptionToday: number;
  preparationsToday: number;
  activeRecipes: number;
  avgPrecision: number;
}

export interface StartOrderInput {
  tankId: string;
  recipe: string;
  liters: number;
  operator: string;
  batch: string;
  estimatedMin: number;
}

interface PlantContextValue {
  tanks: Tank[];
  alarms: Alarm[];
  kpis: PlantKpis;
  bufferLevel: number;
  mainFlow: number;
  startOrder: (input: StartOrderInput) => { ok: boolean; message: string };
  pauseOrder: (tankId: string) => void;
  resumeOrder: (tankId: string) => void;
  cancelOrder: (tankId: string) => void;
  finishOrder: (tankId: string) => void;
  acknowledgeAlarm: (code: string, user: string) => void;
  setTankMode: (tankId: string, mode: 'auto' | 'manual') => void;
  toggleSafetyLock: (tankId: string) => void;
}

const PlantContext = createContext<PlantContextValue | null>(null);

function nowLabel(): string {
  return new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function todayAt(time: string): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()} ${time}`;
}

function jitter(base: number, spread: number): number {
  return base + (Math.random() - 0.5) * 2 * spread;
}

const MAX_SERIES = 45;

function pushPoint(tank: Tank): SeriesPoint[] {
  const point: SeriesPoint = {
    t: nowLabel(),
    cargados: Number(tank.loaded.toFixed(1)),
    caudal: Number(tank.flow.toFixed(1)),
    nivel: Number(((tank.volume / tank.capacity) * 100).toFixed(1)),
  };
  return [...tank.series.slice(-(MAX_SERIES - 1)), point];
}

const INITIAL_TANKS: Tank[] = [
  {
    id: 'TQ-01',
    capacity: 1000,
    volume: 356,
    status: 'llenando',
    recipe: 'Desinfectante Industrial A',
    batch: 'L-2026-006',
    operator: 'Operador 01',
    programmed: 500,
    loaded: 342,
    flow: 44,
    valve: 'EV-01',
    valveOpen: true,
    outValveOpen: false,
    agitator: false,
    sensor: 'LT-01',
    elapsedMin: 8.2,
    estimatedMin: 12,
    mode: 'auto',
    safetyLock: false,
    series: [],
    prepTicks: 0,
    autoCycle: true,
  },
  {
    id: 'TQ-02',
    capacity: 1500,
    volume: 1252,
    status: 'preparando',
    recipe: 'Producto Base E',
    batch: 'L-2026-005',
    operator: 'Operador 02',
    programmed: 1250,
    loaded: 1247.5,
    flow: 0,
    valve: 'EV-02',
    valveOpen: false,
    outValveOpen: false,
    agitator: true,
    sensor: 'LT-02',
    elapsedMin: 27.3,
    estimatedMin: 28,
    mode: 'auto',
    safetyLock: false,
    series: [],
    prepTicks: 90,
    autoCycle: false,
  },
  {
    id: 'TQ-03',
    capacity: 2000,
    volume: 1874,
    status: 'alarma',
    recipe: 'Enjuague / Limpieza CIP',
    batch: 'L-2026-004',
    operator: 'Operador 01',
    programmed: 200,
    loaded: 46.5,
    flow: 0,
    valve: 'EV-03',
    valveOpen: false,
    outValveOpen: false,
    agitator: false,
    sensor: 'LT-03',
    elapsedMin: 2.2,
    estimatedMin: 6,
    mode: 'auto',
    safetyLock: true,
    series: [],
    prepTicks: 0,
    autoCycle: false,
  },
  {
    id: 'TQ-04',
    capacity: 800,
    volume: 64,
    status: 'disponible',
    recipe: null,
    batch: null,
    operator: null,
    programmed: 0,
    loaded: 0,
    flow: 0,
    valve: 'EV-04',
    valveOpen: false,
    outValveOpen: false,
    agitator: false,
    sensor: 'LT-04',
    elapsedMin: 0,
    estimatedMin: 0,
    mode: 'auto',
    safetyLock: false,
    series: [],
    prepTicks: 0,
    autoCycle: false,
  },
];

const INITIAL_ALARMS: Alarm[] = [
  {
    code: 'ALM-001',
    timestamp: todayAt('10:26:31'),
    equipment: 'TQ-03 / LT-03',
    description: 'Nivel alto-alto en TQ-03',
    priority: 'Alta',
    status: 'Activa',
    ackBy: null,
  },
  {
    code: 'ALM-002',
    timestamp: todayAt('09:14:02'),
    equipment: 'EV-02',
    description: 'Válvula EV-02 no confirma apertura',
    priority: 'Alta',
    status: 'Reconocida',
    ackBy: 'Supervisor de Producción',
  },
  {
    code: 'ALM-003',
    timestamp: todayAt('08:47:55'),
    equipment: 'FT-01 / EV-01',
    description: 'Caudal no detectado con válvula abierta',
    priority: 'Alta',
    status: 'Cerrada',
    ackBy: 'Operador 01',
  },
  {
    code: 'ALM-004',
    timestamp: todayAt('08:12:20'),
    equipment: 'TQ-02',
    description: 'Tiempo máximo de llenado superado',
    priority: 'Media',
    status: 'Cerrada',
    ackBy: 'Operador 02',
  },
  {
    code: 'ALM-005',
    timestamp: todayAt('07:58:44'),
    equipment: 'LT-04',
    description: 'Sensor de nivel LT-04 sin señal',
    priority: 'Media',
    status: 'Reconocida',
    ackBy: 'Operador 01',
  },
  {
    code: 'ALM-006',
    timestamp: todayAt('07:31:09'),
    equipment: 'PLC-01',
    description: 'Falla de comunicación con PLC',
    priority: 'Alta',
    status: 'Cerrada',
    ackBy: 'Supervisor de Producción',
  },
  {
    code: 'ALM-007',
    timestamp: todayAt('06:55:37'),
    equipment: 'Sala de preparación',
    description: 'Paro de emergencia activo',
    priority: 'Alta',
    status: 'Cerrada',
    ackBy: 'Supervisor de Producción',
  },
  {
    code: 'ALM-008',
    timestamp: todayAt('06:20:12'),
    equipment: 'TQ-01 / FT-01',
    description:
      'Diferencia superior al límite permitido entre litros programados y litros reales',
    priority: 'Baja',
    status: 'Cerrada',
    ackBy: 'Calidad',
  },
];

let extraAlarmSeq = 9;
let autoBatchSeq = 9;

export function PlantProvider({ children }: { children: ReactNode }) {
  const [tanks, setTanks] = useState<Tank[]>(INITIAL_TANKS);
  const [alarms, setAlarms] = useState<Alarm[]>(INITIAL_ALARMS);
  const [kpis, setKpis] = useState<PlantKpis>({
    consumptionToday: 8450,
    preparationsToday: 18,
    activeRecipes: 2,
    avgPrecision: 98.7,
  });
  const [bufferLevel, setBufferLevel] = useState(78);
  const [mainFlow, setMainFlow] = useState(46);
  const completedRef = useRef(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      let consumedDelta = 0;
      let completed = 0;

      setTanks((prev) =>
        prev.map((tank) => {
          const next: Tank = { ...tank };

          if (next.status === 'llenando') {
            next.flow = Math.max(8, jitter(44, 7));
            const delta = (next.flow / 60) * 2;
            next.loaded = Math.min(next.programmed, next.loaded + delta);
            next.volume = Math.min(next.capacity, next.volume + delta);
            next.elapsedMin += 2 / 60;
            consumedDelta += delta;
            if (next.loaded >= next.programmed) {
              next.status = 'preparando';
              next.flow = 0;
              next.valveOpen = false;
              next.agitator = true;
              next.prepTicks = 45;
              completed += 1;
            }
          } else if (next.status === 'preparando') {
            next.flow = 0;
            next.prepTicks = Math.max(0, next.prepTicks - 1);
            if (next.prepTicks === 0) {
              if (next.autoCycle) {
                autoBatchSeq += 1;
                next.status = 'llenando';
                next.batch = `L-2026-${String(autoBatchSeq).padStart(3, '0')}`;
                next.loaded = 0;
                next.volume = Math.max(40, next.volume - next.programmed);
                next.elapsedMin = 0;
                next.valveOpen = true;
                next.agitator = false;
              } else {
                next.status = 'disponible';
                next.agitator = false;
                next.recipe = null;
                next.batch = null;
                next.operator = null;
                next.programmed = 0;
                next.loaded = 0;
                next.elapsedMin = 0;
                next.estimatedMin = 0;
              }
            }
          } else if (next.status === 'alarma') {
            next.volume = Math.min(
              next.capacity,
              Math.max(0, jitter(next.volume, 1.5)),
            );
            next.flow = 0;
          } else {
            next.flow = 0;
          }

          next.series = pushPoint(next);
          return next;
        }),
      );

      setBufferLevel((prev) => Math.min(96, Math.max(55, jitter(prev, 0.8))));
      setMainFlow(Math.max(0, jitter(46, 6)));

      if (consumedDelta > 0 || completed > 0) {
        completedRef.current += completed;
        setKpis((prev) => ({
          ...prev,
          consumptionToday: prev.consumptionToday + consumedDelta,
          preparationsToday: prev.preparationsToday + completed,
          avgPrecision: Math.min(
            99.4,
            Math.max(97.8, jitter(prev.avgPrecision, 0.05)),
          ),
        }));
      }

      // Alarma ocasional de baja prioridad generada por condiciones de proceso
      if (Math.random() < 0.006) {
        setAlarms((prev) => {
          if (prev.length >= 14) return prev;
          const code = `ALM-${String(extraAlarmSeq++).padStart(3, '0')}`;
          return [
            {
              code,
              timestamp: todayAt(nowLabel()),
              equipment: 'FT-01',
              description: 'Fluctuación transitoria de caudal en línea principal',
              priority: 'Baja',
              status: 'Activa',
              ackBy: null,
            },
            ...prev,
          ];
        });
      }
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const startOrder = useCallback(
    (input: StartOrderInput): { ok: boolean; message: string } => {
      let result = { ok: false, message: 'Tanque no disponible para iniciar receta' };
      setTanks((prev) =>
        prev.map((tank) => {
          if (tank.id !== input.tankId) return tank;
          if (tank.status !== 'disponible' && tank.status !== 'espera') {
            return tank;
          }
          result = { ok: true, message: `Receta iniciada en ${tank.id}` };
          return {
            ...tank,
            status: 'llenando',
            recipe: input.recipe,
            batch: input.batch,
            operator: input.operator,
            programmed: input.liters,
            loaded: tank.status === 'espera' ? tank.loaded : 0,
            estimatedMin: input.estimatedMin,
            elapsedMin: tank.status === 'espera' ? tank.elapsedMin : 0,
            valveOpen: true,
            agitator: false,
            safetyLock: false,
          };
        }),
      );
      return result;
    },
    [],
  );

  const pauseOrder = useCallback((tankId: string) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === tankId && tank.status === 'llenando'
          ? { ...tank, status: 'espera', flow: 0, valveOpen: false }
          : tank,
      ),
    );
  }, []);

  const resumeOrder = useCallback((tankId: string) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === tankId && tank.status === 'espera'
          ? { ...tank, status: 'llenando', valveOpen: true }
          : tank,
      ),
    );
  }, []);

  const cancelOrder = useCallback((tankId: string) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === tankId
          ? {
              ...tank,
              status: 'disponible',
              recipe: null,
              batch: null,
              operator: null,
              programmed: 0,
              loaded: 0,
              flow: 0,
              valveOpen: false,
              agitator: false,
              elapsedMin: 0,
              estimatedMin: 0,
              autoCycle: false,
            }
          : tank,
      ),
    );
  }, []);

  const finishOrder = useCallback((tankId: string) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === tankId && (tank.status === 'llenando' || tank.status === 'espera')
          ? {
              ...tank,
              status: 'preparando',
              flow: 0,
              valveOpen: false,
              agitator: true,
              prepTicks: 30,
              autoCycle: false,
            }
          : tank,
      ),
    );
    setKpis((prev) => ({
      ...prev,
      preparationsToday: prev.preparationsToday + 1,
    }));
  }, []);

  const acknowledgeAlarm = useCallback((code: string, user: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.code === code && alarm.status === 'Activa'
          ? { ...alarm, status: 'Reconocida', ackBy: user }
          : alarm,
      ),
    );
  }, []);

  const setTankMode = useCallback((tankId: string, mode: 'auto' | 'manual') => {
    setTanks((prev) =>
      prev.map((tank) => (tank.id === tankId ? { ...tank, mode } : tank)),
    );
  }, []);

  const toggleSafetyLock = useCallback((tankId: string) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === tankId ? { ...tank, safetyLock: !tank.safetyLock } : tank,
      ),
    );
  }, []);

  return (
    <PlantContext.Provider
      value={{
        tanks,
        alarms,
        kpis,
        bufferLevel,
        mainFlow,
        startOrder,
        pauseOrder,
        resumeOrder,
        cancelOrder,
        finishOrder,
        acknowledgeAlarm,
        setTankMode,
        toggleSafetyLock,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant(): PlantContextValue {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error('usePlant debe usarse dentro de PlantProvider');
  return ctx;
}

export const TANK_STATUS_LABEL: Record<TankStatus, string> = {
  disponible: 'Disponible',
  llenando: 'Llenando',
  preparando: 'Preparando',
  espera: 'En espera',
  alarma: 'Alarma',
};

export const TANK_STATUS_COLOR: Record<TankStatus, string> = {
  disponible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  llenando: 'bg-sky-100 text-sky-700 border-sky-200',
  preparando: 'bg-teal-100 text-teal-700 border-teal-200',
  espera: 'bg-slate-200 text-slate-600 border-slate-300',
  alarma: 'bg-red-100 text-red-700 border-red-200',
};

export const TANK_STATUS_HEX: Record<TankStatus, string> = {
  disponible: '#10b981',
  llenando: '#0ea5e9',
  preparando: '#14b8a6',
  espera: '#94a3b8',
  alarma: '#ef4444',
};
