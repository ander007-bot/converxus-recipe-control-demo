import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const TONES: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-sky-100 text-sky-600',
};

export default function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = 'default',
}: KpiCardProps) {
  return (
    <div className="card flex items-center gap-3 px-4 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight text-slate-800">{value}</p>
        {detail && <p className="truncate text-xs text-slate-400">{detail}</p>}
      </div>
    </div>
  );
}
