import {
  TANK_STATUS_COLOR,
  TANK_STATUS_LABEL,
  type TankStatus,
} from '../context/PlantContext';

export default function StatusBadge({ status }: { status: TankStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TANK_STATUS_COLOR[status]}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {(status === 'llenando' || status === 'alarma') && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {TANK_STATUS_LABEL[status]}
    </span>
  );
}
