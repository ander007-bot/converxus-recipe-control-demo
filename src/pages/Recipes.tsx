import { useMemo, useState } from 'react';
import { Play, Pause, XCircle, CheckCircle2, FlaskConical, Clock3 } from 'lucide-react';
import { RECIPES, OPERATORS } from '../data/recipes';
import { usePlant, TANK_STATUS_LABEL } from '../context/PlantContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import { formatLiters, formatNumber } from '../utils/format';

export default function Recipes() {
  const { tanks, startOrder, pauseOrder, resumeOrder, cancelOrder, finishOrder } =
    usePlant();
  const { notify } = useToast();

  const [recipeId, setRecipeId] = useState(RECIPES[0].id);
  const [tankId, setTankId] = useState('TQ-04');
  const [liters, setLiters] = useState(RECIPES[0].liters);
  const [operator, setOperator] = useState(OPERATORS[0]);
  const [batch, setBatch] = useState('L-2026-010');

  const recipe = useMemo(
    () => RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0],
    [recipeId],
  );
  const tank = tanks.find((t) => t.id === tankId);

  const handleRecipeChange = (id: string) => {
    setRecipeId(id);
    const selected = RECIPES.find((r) => r.id === id);
    if (selected) setLiters(selected.liters);
  };

  const handleStart = () => {
    if (!tank) return;
    if (tank.status === 'espera') {
      resumeOrder(tank.id);
      notify(`Receta reanudada en ${tank.id}`, 'success');
      return;
    }
    const result = startOrder({
      tankId,
      recipe: recipe.name,
      liters,
      operator,
      batch,
      estimatedMin: Math.round((liters / recipe.liters) * recipe.minutes),
    });
    notify(result.message, result.ok ? 'success' : 'warning');
  };

  const handlePause = () => {
    if (!tank) return;
    pauseOrder(tank.id);
    notify(`Receta en pausa en ${tank.id}`, 'info');
  };

  const handleCancel = () => {
    if (!tank) return;
    cancelOrder(tank.id);
    notify(`Orden cancelada en ${tank.id}`, 'warning');
  };

  const handleFinish = () => {
    if (!tank) return;
    finishOrder(tank.id);
    notify(`Lote finalizado en ${tank.id}. Registro enviado a trazabilidad.`, 'success');
  };

  const progress =
    tank && tank.programmed > 0
      ? Math.min(100, (tank.loaded / tank.programmed) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Control automático de preparación por recetas
        </h2>
        <p className="text-sm text-slate-500">
          Litros programados vs litros reales · Reducción de errores humanos ·
          Preparación repetible y documentada
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* Tabla de recetas */}
        <div className="card xl:col-span-3">
          <div className="card-header">
            <h3 className="card-title">Recetas configuradas</h3>
            <span className="text-xs text-slate-400">{RECIPES.length} recetas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Receta</th>
                  <th>Volumen estándar</th>
                  <th>Tiempo estimado</th>
                  <th>Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {RECIPES.map((r) => (
                  <tr
                    key={r.id}
                    className={r.id === recipeId ? '!bg-brand-50' : undefined}
                  >
                    <td className="font-mono text-xs">{r.id}</td>
                    <td className="font-semibold">{r.name}</td>
                    <td>{formatLiters(r.liters)}</td>
                    <td>{r.minutes} min</td>
                    <td className="max-w-56 text-xs text-slate-500">{r.description}</td>
                    <td>
                      <button
                        className="btn-secondary !px-2 !py-1 text-xs"
                        onClick={() => handleRecipeChange(r.id)}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel de orden */}
        <div className="card xl:col-span-2">
          <div className="card-header">
            <h3 className="card-title">Nueva orden de preparación</h3>
            <FlaskConical className="h-4 w-4 text-brand-600" />
          </div>
          <div className="space-y-3 p-4">
            <div>
              <label className="label" htmlFor="recipe">
                Receta
              </label>
              <select
                id="recipe"
                className="input"
                value={recipeId}
                onChange={(e) => handleRecipeChange(e.target.value)}
              >
                {RECIPES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="tank">
                  Tanque destino
                </label>
                <select
                  id="tank"
                  className="input"
                  value={tankId}
                  onChange={(e) => setTankId(e.target.value)}
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} — {TANK_STATUS_LABEL[t.status]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="liters">
                  Litros requeridos
                </label>
                <input
                  id="liters"
                  type="number"
                  min={1}
                  className="input"
                  value={liters}
                  onChange={(e) => setLiters(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="operator">
                  Operador
                </label>
                <select
                  id="operator"
                  className="input"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  {OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="batch">
                  Lote
                </label>
                <input
                  id="batch"
                  className="input font-mono"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <Clock3 className="h-4 w-4 shrink-0" />
              Tiempo estimado para {formatLiters(liters)}:{' '}
              <strong className="text-slate-700">
                {Math.max(1, Math.round((liters / recipe.liters) * recipe.minutes))} min
              </strong>
            </div>

            {/* Estado del tanque destino */}
            {tank && (
              <div className="rounded-md border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {tank.id} — Estado operativo
                  </span>
                  <StatusBadge status={tank.status} />
                </div>
                {tank.programmed > 0 ? (
                  <>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>
                        {formatNumber(tank.loaded, 1)} / {formatNumber(tank.programmed)}{' '}
                        L
                      </span>
                      <span className="font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-sky-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Receta: {tank.recipe} · Lote:{' '}
                      <span className="font-mono">{tank.batch}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">
                    Sin orden activa en este tanque
                  </p>
                )}
              </div>
            )}

            {/* Botones de operación */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn-primary"
                onClick={handleStart}
                disabled={
                  !tank || (tank.status !== 'disponible' && tank.status !== 'espera')
                }
              >
                <Play className="h-4 w-4" />
                Iniciar
              </button>
              <button
                className="btn-warning"
                onClick={handlePause}
                disabled={!tank || tank.status !== 'llenando'}
              >
                <Pause className="h-4 w-4" />
                Pausar
              </button>
              <button
                className="btn-danger"
                onClick={handleCancel}
                disabled={
                  !tank ||
                  (tank.status !== 'llenando' && tank.status !== 'espera')
                }
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </button>
              <button
                className="btn-secondary"
                onClick={handleFinish}
                disabled={
                  !tank ||
                  (tank.status !== 'llenando' && tank.status !== 'espera')
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                Finalizar lote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
