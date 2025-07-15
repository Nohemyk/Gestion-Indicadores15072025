import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseAuthProvider, useSupabaseAuthContext } from './context/SupabaseAuthContext'; // <-- ¡CORREGIDO AQUÍ!
import { SupabaseLoginForm } from './components/Auth/SupabaseLoginForm';
import { SupabaseSetup } from './components/Setup/SupabaseSetup';
import { HomePage } from './pages/HomePage';
import { ReportsView } from './components/Reports/ReportsView';
import { SettingsPage } from './pages/SettingsPage';
import { Spinner } from './components/Spinner/Spinner';
import { IndicatorManagement } from './components/IndicatorManagement/IndicatorManagement';
import { RiskManagement } from './components/RiskManagement/RiskManagement';

// Componente PrivateRoute para proteger rutas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useSupabaseAuthContext(); // <-- ¡CORREGIDO AQUÍ!

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
        <p className="ml-2 text-gray-700">Cargando autenticación...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Routes>
          {/* Ruta de Login - accesible para todos */}
          <Route path="/login" element={<SupabaseLoginForm />} />

          {/* Ruta de Configuración de Supabase - quizás solo para la primera vez */}
          <Route path="/setup" element={<SupabaseSetup />} />

          {/* Rutas Protegidas - solo accesibles si el usuario está autenticado */}
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/indicators" element={<PrivateRoute><IndicatorManagement /></PrivateRoute>} />
          <Route path="/risks" element={<PrivateRoute><RiskManagement /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><ReportsView indicators={[]} risks={[]} selectedArea="all" /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

          {/* Puedes añadir una ruta de fallback para 404s */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
};

export default App;