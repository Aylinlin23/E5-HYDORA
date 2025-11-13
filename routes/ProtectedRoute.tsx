import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - isAuthenticated:', !!user);

  if (loading) {
  console.log('ProtectedRoute - Mostrando loading...');
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F7FA'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E5E7EB',
          borderTop: '4px solid #1F6FEB',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{
          marginTop: '16px',
          color: '#6B7280',
          fontSize: '16px'
        }}>Verificando sesión...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
  console.log('ProtectedRoute - No hay usuario, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Usuario autenticado, mostrando contenido');
  return <>{children}</>;
};

export default ProtectedRoute; 
