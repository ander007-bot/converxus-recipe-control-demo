import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Waves, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/', { replace: true });
    } else {
      setError('Credenciales incorrectas. Verifique el correo y la contraseña.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg">
            <Waves className="h-7 w-7 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white">
            CONVERXUS <span className="font-light text-cyan-300">Recipe Control</span>
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Control, dosificación y trazabilidad de preparación por recetas
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="rounded-xl border border-slate-700 bg-white p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-800">Iniciar sesión</h2>
          <p className="mb-5 text-sm text-slate-500">
            Ingrese sus credenciales para acceder a la plataforma
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className="input pl-9"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  className="input pl-9"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full !py-2.5">
              Ingresar a la plataforma
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-4 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Acceso restringido — solo personal autorizado
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Powered by Converxus · Converxus Industrial Platform
        </p>
      </div>
    </div>
  );
}
