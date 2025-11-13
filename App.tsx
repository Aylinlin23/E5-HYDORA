import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { StatsProvider } from './store/StatsContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateReportPage from './pages/CreateReportPage';
import MyReportsPage from './pages/MyReportsPage';
import AuthorityReportsPage from './pages/AuthorityReportsPage';
import MapPage from './pages/MapPage';
import AdvancedMapPage from './pages/AdvancedMapPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import ReportsPanel from './pages/ReportsPanel';
import WaterGuidesPage from './pages/WaterGuidesPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { UserRole } from './types/roles';

// Componente para rutas públicas (solo para usuarios no autenticados)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F7FA'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #1F6FEB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6B7280' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Estilos globales
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F5F7FA;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 10px rgba(31,41,55,0.08);
    border: 1px solid #E2E8F0;
  }

  .button {
    background-color: #1F6FEB;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }

  .button:hover {
    background-color: #1D4ED8;
    transform: translateY(-1px);
  }

  .button:disabled {
    background-color: #9CA3AF;
    cursor: not-allowed;
    transform: none;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge--blue {
    background-color: #DBEAFE;
    color: #1E40AF;
  }

  .badge--yellow {
    background-color: #FEF3C7;
    color: #92400E;
  }

  .badge--green {
    background-color: #D1FAE5;
    color: #065F46;
  }

  .badge--red {
    background-color: #FEE2E2;
    color: #991B1B;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #1F6FEB;
    box-shadow: 0 0 0 3px rgba(31,111,235,0.1);
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
  }
`;

function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <AuthProvider>
        <StatsProvider>
            <Router>
              <div className="App">
            <Routes>
              {/* Rutas públicas */}
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                
                <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } />

              {/* Rutas protegidas - Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Reportes */}
              <Route path="/create-report" element={
                <ProtectedRoute>
                  <Layout>
                    <CreateReportPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/my-reports" element={
                <ProtectedRoute requiredRoles={['CITIZEN']}>
                  <Layout>
                    <MyReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Mapa */}
              <Route path="/map" element={
                <ProtectedRoute>
                  <Layout>
                    <AdvancedMapPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Perfil */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Gestión de usuarios (solo admin) */}
              <Route path="/users" element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Panel de reportes unificado */}
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPanel />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Panel de reportes autoridad (legacy) */}
              <Route path="/authority/reports" element={
                <ProtectedRoute requiredRoles={['AUTHORITY', 'ADMIN']}>
                  <Layout>
                    <AuthorityReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Guías de agua */}
              <Route path="/guide" element={
                <ProtectedRoute>
                  <Layout>
                    <WaterGuidesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Ruta alternativa */}
              <Route path="/water-guides" element={
                <ProtectedRoute>
                  <Layout>
                    <WaterGuidesPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Detalle de reporte */}
              <Route path="/reports/:id" element={
                <ProtectedRoute>
                  <div className="card" style={{margin: '24px', padding: '32px', textAlign: 'center'}}>
                    <h2>Detalle del Reporte</h2>
                    <p>Página en desarrollo - Aquí se mostrará el detalle completo del reporte con historial y comentarios</p>
                    <button className="button" onClick={() => window.history.back()}>Volver</button>
                  </div>
                </ProtectedRoute>
              } />

              {/* Rutas protegidas - Editar reporte */}
              <Route path="/reports/:id/edit" element={
                <ProtectedRoute>
                  <div className="card" style={{margin: '24px', padding: '32px', textAlign: 'center'}}>
                    <h2>Editar Reporte</h2>
                    <p>Página en desarrollo - Aquí se podrá editar el reporte</p>
                    <button className="button" onClick={() => window.history.back()}>Volver</button>
                  </div>
                </ProtectedRoute>
              } />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
              </div>
            </Router>
        </StatsProvider>
      </AuthProvider>
    </>
  );
}

export default App; 