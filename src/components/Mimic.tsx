import {
  usePlant,
  TANK_STATUS_HEX,
  TANK_STATUS_LABEL,
  type Tank,
} from '../context/PlantContext';
import { formatNumber } from '../utils/format';

const PIPE = '#94a3b8';
const FLOW = '#0ea5e9';

/** Posiciones horizontales de las 4 bajantes del manifold. */
const DROPS = [520, 700, 880, 1060];

function TankGlyph({ tank, x }: { tank: Tank; x: number }) {
  const levelPct = Math.min(100, (tank.volume / tank.capacity) * 100);
  const tankTop = 380;
  const tankH = 110;
  const tankW = 130;
  const fillH = (levelPct / 100) * (tankH - 8);
  const color = TANK_STATUS_HEX[tank.status];
  const progress =
    tank.programmed > 0 ? Math.min(100, (tank.loaded / tank.programmed) * 100) : 0;

  return (
    <g>
      {/* Cuerpo del tanque */}
      <rect
        x={x - tankW / 2}
        y={tankTop}
        width={tankW}
        height={tankH}
        rx={10}
        fill="#f8fafc"
        stroke="#64748b"
        strokeWidth={2}
      />
      {/* Nivel */}
      <rect
        x={x - tankW / 2 + 4}
        y={tankTop + (tankH - 4) - fillH}
        width={tankW - 8}
        height={fillH}
        rx={6}
        fill={color}
        opacity={0.55}
        style={{ transition: 'all 0.7s ease' }}
      />
      {/* Etiquetas dentro del tanque */}
      <text x={x} y={tankTop + 24} textAnchor="middle" fontSize={15} fontWeight={700} fill="#1e293b">
        {tank.id}
      </text>
      <text x={x} y={tankTop + 42} textAnchor="middle" fontSize={11} fill="#475569">
        {formatNumber(tank.volume)} / {formatNumber(tank.capacity)} L
      </text>
      <text x={x} y={tankTop + 58} textAnchor="middle" fontSize={11} fontWeight={600} fill={color}>
        {TANK_STATUS_LABEL[tank.status]}
      </text>
      <text x={x} y={tankTop + 74} textAnchor="middle" fontSize={10} fill="#64748b">
        {tank.sensor} · {levelPct.toFixed(0)}%
      </text>

      {/* Receta activa y avance bajo el tanque */}
      {tank.recipe ? (
        <>
          <text x={x} y={tankTop + tankH + 18} textAnchor="middle" fontSize={10} fill="#334155" fontWeight={600}>
            {tank.recipe.length > 24 ? tank.recipe.slice(0, 23) + '…' : tank.recipe}
          </text>
          <text x={x} y={tankTop + tankH + 32} textAnchor="middle" fontSize={10} fill="#64748b">
            {formatNumber(tank.loaded, 1)} / {formatNumber(tank.programmed)} L ·{' '}
            {progress.toFixed(0)}%
          </text>
          {/* Barra de avance */}
          <rect x={x - 50} y={tankTop + tankH + 38} width={100} height={5} rx={2.5} fill="#e2e8f0" />
          <rect
            x={x - 50}
            y={tankTop + tankH + 38}
            width={progress}
            height={5}
            rx={2.5}
            fill={color}
            style={{ transition: 'width 0.7s ease' }}
          />
        </>
      ) : (
        <text x={x} y={tankTop + tankH + 18} textAnchor="middle" fontSize={10} fill="#94a3b8">
          Sin receta asignada
        </text>
      )}
    </g>
  );
}

function ValveGlyph({ tank, x }: { tank: Tank; x: number }) {
  const open = tank.valveOpen;
  const y = 315;
  return (
    <g>
      {/* Cuerpo de válvula (dos triángulos) */}
      <path
        d={`M ${x - 11} ${y - 9} L ${x} ${y} L ${x - 11} ${y + 9} Z M ${x + 11} ${y - 9} L ${x} ${y} L ${x + 11} ${y + 9} Z`}
        fill={open ? '#0ea5e9' : '#64748b'}
        stroke="#334155"
        strokeWidth={1}
      />
      <line x1={x} y1={y} x2={x} y2={y - 14} stroke="#334155" strokeWidth={1.5} />
      <circle cx={x} cy={y - 17} r={4} fill={open ? '#0ea5e9' : '#94a3b8'} stroke="#334155" strokeWidth={1} />
      <text x={x + 18} y={y - 8} fontSize={11} fontWeight={700} fill="#334155">
        {tank.valve}
      </text>
      <text x={x + 18} y={y + 5} fontSize={10} fill={open ? '#0284c7' : '#64748b'} fontWeight={600}>
        {open ? 'Abierta' : 'Cerrada'}
      </text>
      {/* Caudal instantáneo cuando llena */}
      {tank.flow > 0 && (
        <text x={x + 18} y={y + 19} fontSize={10} fill="#0ea5e9">
          {formatNumber(tank.flow, 1)} L/min
        </text>
      )}
    </g>
  );
}

export default function Mimic() {
  const { tanks, bufferLevel, mainFlow } = usePlant();
  const manifoldY = 250;
  const bufferFillH = (bufferLevel / 100) * 96;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 1200 560"
        className="min-w-[900px]"
        role="img"
        aria-label="Mímico del proceso de preparación por recetas"
      >
        {/* ===== Fuente tratada ===== */}
        <rect x={20} y={195} width={150} height={110} rx={10} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
        <circle cx={50} cy={228} r={13} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
        <path d="M 50 220 C 45 228 45 232 50 234 C 55 232 55 228 50 220 Z" fill="#3b82f6" />
        <text x={72} y={225} fontSize={12} fontWeight={700} fill="#1e40af">
          Fuente tratada
        </text>
        <text x={30} y={252} fontSize={10} fill="#334155">
          Agua tratada /
        </text>
        <text x={30} y={266} fontSize={10} fill="#334155">
          Materia prima líquida
        </text>
        <text x={30} y={288} fontSize={10} fontWeight={600} fill="#059669">
          ● En servicio
        </text>

        {/* Tubería fuente → tanque pulmón */}
        <line x1={170} y1={manifoldY} x2={225} y2={manifoldY} stroke={PIPE} strokeWidth={7} />
        <line x1={170} y1={manifoldY} x2={225} y2={manifoldY} stroke={FLOW} strokeWidth={3} className="flow-line" />

        {/* ===== Tanque pulmón TP-01 ===== */}
        <rect x={225} y={190} width={110} height={120} rx={12} fill="#f8fafc" stroke="#64748b" strokeWidth={2} />
        <rect
          x={229}
          y={190 + 116 - bufferFillH}
          width={102}
          height={bufferFillH}
          rx={8}
          fill="#38bdf8"
          opacity={0.5}
          style={{ transition: 'all 0.7s ease' }}
        />
        <text x={280} y={215} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1e293b">
          TP-01
        </text>
        <text x={280} y={232} textAnchor="middle" fontSize={10} fill="#475569">
          Tanque pulmón
        </text>
        <text x={280} y={250} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0369a1">
          {bufferLevel.toFixed(0)}% nivel
        </text>

        {/* Tubería pulmón → manifold */}
        <line x1={335} y1={manifoldY} x2={400} y2={manifoldY} stroke={PIPE} strokeWidth={7} />
        <line x1={335} y1={manifoldY} x2={400} y2={manifoldY} stroke={FLOW} strokeWidth={3} className="flow-line" />

        {/* ===== Caudalímetro FT-01 ===== */}
        <circle cx={425} cy={manifoldY} r={24} fill="#fff" stroke="#0e7ac4" strokeWidth={2.5} />
        <text x={425} y={manifoldY - 2} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0e7ac4">
          FT-01
        </text>
        <text x={425} y={manifoldY + 11} textAnchor="middle" fontSize={9} fill="#475569">
          caudal
        </text>
        <text x={425} y={manifoldY + 44} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0284c7">
          {formatNumber(mainFlow, 1)} L/min
        </text>

        {/* ===== Manifold principal ===== */}
        <text x={449} y={manifoldY - 16} fontSize={11} fontWeight={600} fill="#475569">
          Manifold de distribución
        </text>
        <line x1={449} y1={manifoldY} x2={1120} y2={manifoldY} stroke={PIPE} strokeWidth={7} />
        {mainFlow > 1 && (
          <line x1={449} y1={manifoldY} x2={1120} y2={manifoldY} stroke={FLOW} strokeWidth={3} className="flow-line" />
        )}

        {/* ===== Bajantes, válvulas y tanques ===== */}
        {tanks.map((tank, i) => {
          const x = DROPS[i];
          return (
            <g key={tank.id}>
              {/* Bajante manifold → válvula → tanque */}
              <line x1={x} y1={manifoldY} x2={x} y2={380} stroke={PIPE} strokeWidth={6} />
              {tank.valveOpen && tank.flow > 0 && (
                <line x1={x} y1={manifoldY} x2={x} y2={380} stroke={FLOW} strokeWidth={3} className="flow-line" />
              )}
              <ValveGlyph tank={tank} x={x} />
              <TankGlyph tank={tank} x={x} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
