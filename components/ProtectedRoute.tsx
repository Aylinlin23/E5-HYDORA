import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { WarningIcon } from '../ui/Icons';
import { canAccessRoute, UserRole } from '../types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = []
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

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
          <p style={{ color: '#6B7280' }}>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role as UserRole)) {
    return <AccessDenied />;
  }

  const hasAccess = canAccessRoute(user.role as UserRole, location.pathname);
  if (!hasAccess) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

const AccessDenied: React.FC = () => {
  const { user } = useAuth();
  
  const getDashboardPath = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/dashboard';
      case 'AUTHORITY':
        return '/dashboard';
      case 'CITIZEN':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5F7FA',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '48px',
        boxShadow: '0 4px 10px rgba(31,41,55,0.08)',
        border: '1px solid #E2E8F0',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#FEF2F2',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <WarningIcon size={32} />
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '12px'
        }}>
          Acceso Denegado
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Tu rol no tiene permiso para ver esta sección. Si crees que es un error, contacta al administrador.
        </p>

        <div style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #0EA5E9',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#0EA5E9',
            margin: '0'
          }}>
            <strong>Rol actual:</strong> {user?.role === 'ADMIN' ? 'Administrador' : 
              user?.role === 'AUTHORITY' ? 'Autoridad' : 'Ciudadano'}
          </p>
        </div>

        <button
          onClick={() => window.location.href = getDashboardPath()}
          style={{
            backgroundColor: '#1F6FEB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ProtectedRoute; 