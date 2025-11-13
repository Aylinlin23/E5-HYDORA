import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CreateReportPage from '../pages/CreateReportPage';
import MyReportsPage from '../pages/MyReportsPage';
import MapPage from '../pages/MapPage';
import ProfilePage from '../pages/ProfilePage';
import AuthorityPanelPage from '../pages/AuthorityPanelPage';
import AuthorityReportsPage from '../pages/AuthorityReportsPage';
import AdminPanelPage from '../pages/AdminPanelPage';
import TestNotificationsPage from '../pages/TestNotificationsPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-report"
        element={
          <ProtectedRoute>
            <CreateReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Panel de autoridad */}
      <Route
        path="/authority"
        element={
          <ProtectedRoute>
            <AuthorityPanelPage />
          </ProtectedRoute>
        }
      />

      {/* Gestión avanzada de reportes para autoridades */}
      <Route
        path="/authority/reports"
        element={
          <ProtectedRoute>
            <AuthorityReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Panel de admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanelPage />
          </ProtectedRoute>
        }
      />

      {/* Página de prueba de notificaciones */}
      <Route
        path="/test-notifications"
        element={
          <ProtectedRoute>
            <TestNotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes; 