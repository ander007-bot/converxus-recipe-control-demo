import { TANK_STATUS_HEX, type TankStatus } from '../context/PlantContext';

interface TankLevelProps {
  percent: number;
  status: TankStatus;
}

/** Representación vertical del nivel de un tanque. */
export default function TankLevel({ percent, status }: TankLevelProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex h-32 w-14 flex-col items-center">
      <div className="relative h-full w-10 overflow-hidden rounded-md border-2 border-slate-300 bg-slate-50">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700"
          style={{
            height: `${clamped}%`,
            backgroundColor: TANK_STATUS_HEX[status],
            opacity: 0.75,
          }}
        />
        {/* Marcas de nivel */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute left-0 h-px w-2 bg-slate-300"
            style={{ bottom: `${mark}%` }}
          />
        ))}
      </div>
      <span className="mt-1 text-xs font-bold text-slate-600">
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
}
