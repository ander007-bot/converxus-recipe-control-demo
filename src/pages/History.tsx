import { useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { HISTORY } from '../data/history';
import { RECIPES, OPERATORS } from '../data/recipes';
import { useToast } from '../context/ToastContext';
import { formatNumber } from '../utils/format';

const STATES = ['Todos', 'Correcto', 'Detenido', 'Cancelado'] as const;

export default function HistoryPage() {
  const { notify } = useToast();
  const [date, setDate] = useState('');
  const [tank, setTank] = useState('Todos');
  const [recipe, setRecipe] = useState('Todas');
  const [operator, setOperator] = useState('Todos');
  const [state, setState] = useState<(typeof STATES)[number]>('Todos');

  const rows = useMemo(
    () =>
      HISTORY.filter((r) => {
        if (date && !r.date.startsWith(date)) return false;
        if (tank !== 'Todos' && r.tank !== tank) return false;
        if (recipe !== 'Todas' && r.recipe !== recipe) return false;
        if (operator !== 'Todos' && r.operator !== operator) return false;
        if (state !== 'Todos' && r.finalState !== state) return false;
        return true;
      }),
    [date, tank, recipe, operator, state],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Históricos y trazabilidad
          </h2>
          <p className="text-sm text-slate-500">
            Trazabilidad por lote, tanque, receta y operador
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() =>
              notify('Reporte Excel generado para demo (simulado)', 'success')
            }
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Exportar Excel
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              notify('Reporte PDF generado para demo (simulado)', 'success')
            }
          >
            <FileText className="h-4 w-4 text-red-600" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Filter className="h-4 w-4" />
          Filtros
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <div>
            <label className="label">Fecha</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Tanque</label>
            <select className="input" value={tank} onChange={(e) => setTank(e.target.value)}>
              {['Todos', 'TQ-01', 'TQ-02', 'TQ-03', 'TQ-04'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Receta</label>
            <select
              className="input"
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
            >
              <option>Todas</option>
              {RECIPES.map((r) => (
                <option key={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Operador</label>
            <select
              className="input"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option>Todos</option>
              {OPERATORS.map((op) => (
                <option key={op}>{op}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Estado</label>
            <select
              className="input"
              value={state}
              onChange={(e) => setState(e.target.value as (typeof STATES)[number])}
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de históricos */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Historial de preparaciones</h3>
          <span className="text-xs text-slate-400">{rows.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Lote</th>
                <th>Receta</th>
                <th>Tanque</th>
                <th>Operador</th>
                <th>Programado</th>
                <th>Real</th>
                <th>Diferencia</th>
                <th>Tiempo</th>
                <th>Estado final</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const diff = r.real !== null ? r.real - r.programmed : null;
                return (
                  <tr key={r.batch}>
                    <td className="whitespace-nowrap font-mono text-xs">{r.date}</td>
                    <td className="font-mono text-xs font-semibold">{r.batch}</td>
                    <td>{r.recipe}</td>
                    <td className="font-semibold">{r.tank}</td>
                    <td className="text-xs">{r.operator}</td>
                    <td>{formatNumber(r.programmed)} L</td>
                    <td>{r.real !== null ? `${formatNumber(r.real, 1)} L` : '—'}</td>
                    <td
                      className={
                        diff !== null && Math.abs(diff) > 3
                          ? 'font-semibold text-amber-600'
                          : ''
                      }
                    >
                      {diff !== null
                        ? `${diff > 0 ? '+' : ''}${formatNumber(diff, 1)} L`
                        : '—'}
                    </td>
                    <td className="whitespace-nowrap text-xs">{r.fillTime}</td>
                    <td>
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
                          r.finalState === 'Correcto'
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                            : r.finalState === 'Detenido'
                              ? 'border-amber-200 bg-amber-100 text-amber-700'
                              : 'border-slate-200 bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.finalState}
                      </span>
                    </td>
                    <td className="max-w-56 text-xs text-slate-500">{r.note}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No hay registros que coincidan con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card px-4 py-3 text-sm text-slate-500">
        Cada preparación queda registrada con lote, receta, tanque, operador, litros
        programados, litros reales y tiempo de llenado — Reportes para producción,
        calidad y gerencia.
      </div>
    </div>
  );
}
