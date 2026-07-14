import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Database,
  BellRing,
  History,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Waves,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlant } from '../context/PlantContext';
import { formatDateTime } from '../utils/format';

const NAV_ITEMS = [
  { to: '/', label: 'Vista general', icon: LayoutDashboard, end: true },
  { to: '/recetas', label: 'Control de recetas', icon: FlaskConical, end: false },
  { to: '/tanques', label: 'Tanques', icon: Database, end: false },
  { to: '/alarmas', label: 'Alarmas', icon: BellRing, end: false },
  { to: '/historicos', label: 'Históricos', icon: History, end: false },
  { to: '/reportes', label: 'Reportes', icon: BarChart3, end: false },
  { to: '/configuracion', label: 'Configuración', icon: Settings, end: false },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="hidden font-mono text-xs text-slate-500 md:inline">
      {formatDateTime(now)}
    </span>
  );
}

export default function Layout() {
  const { userEmail, userName, logout } = useAuth();
  const { alarms } = usePlant();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeAlarms = alarms.filter((a) => a.status === 'Activa').length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <Waves className="h-5 w-5 text-cyan-300" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-wide text-white">
            CONVERXUS
          </p>
          <p className="truncate text-[11px] text-slate-400">Recipe Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {to === '/alarmas' && activeAlarms > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeAlarms}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
          <span>Converxus Industrial Platform</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">Powered by Converxus</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar escritorio */}
      <aside className="hidden w-60 shrink-0 lg:block">{sidebar}</aside>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-60">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-800">
              Converxus Recipe Control
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              Control, dosificación y trazabilidad de preparación por recetas
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sistema: Operativo
            </span>
            <Clock />
            <span
              className="hidden max-w-56 truncate text-right text-xs leading-tight text-slate-500 xl:inline-block"
              title={userEmail ?? undefined}
            >
              <span className="block font-semibold text-slate-600">{userName}</span>
              {userEmail}
            </span>
            <button onClick={handleLogout} className="btn-secondary !px-2.5 !py-1.5">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
