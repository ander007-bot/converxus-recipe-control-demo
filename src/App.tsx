import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlantProvider } from './context/PlantContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Recipes from './pages/Recipes';
import Tanks from './pages/Tanks';
import TankDetail from './pages/TankDetail';
import Alarms from './pages/Alarms';
import HistoryPage from './pages/History';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PlantProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Overview />} />
                  <Route path="/recetas" element={<Recipes />} />
                  <Route path="/tanques" element={<Tanks />} />
                  <Route path="/tanques/:tankId" element={<TankDetail />} />
                  <Route path="/alarmas" element={<Alarms />} />
                  <Route path="/historicos" element={<HistoryPage />} />
                  <Route path="/reportes" element={<Reports />} />
                  <Route path="/configuracion" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PlantProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
