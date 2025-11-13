import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useStats } from '../store/StatsContext';
import Navigation from '../components/Navigation';
import { reportService, authService } from '../services/api';
import { CalendarIcon, UsersIcon, DocumentIcon } from '../ui/Icons';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, refreshStats } = useStats();

  if (!user) return null;

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'AUTHORITY': return 'Autoridad';
      case 'CITIZEN': return 'Ciudadano';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#DC2626';
      case 'AUTHORITY': return '#F59E0B';
      case 'CITIZEN': return '#22C55E';
      default: return '#6B7280';
    }
  };

  // Dashboard específico para Ciudadano
  const CitizenDashboard = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          Bienvenido, {user.name}
        </h1>
        <p style={{ color: '#6B7280' }}>
          Gestiona tus reportes y contribuye a mejorar tu comunidad
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
            Mis Reportes
          </h3>
            <button
              onClick={refreshStats}
              disabled={loading}
              style={{
                padding: '4px 8px',
                backgroundColor: loading ? '#E5E7EB' : '#F3F4F6',
                color: loading ? '#9CA3AF' : '#374151',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Actualizar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total creados:</span>
              <strong>{loading ? '...' : stats.totalReports}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pendientes:</span>
              <strong style={{ color: '#F59E0B' }}>{loading ? '...' : stats.pendingReports}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Resueltos:</span>
              <strong style={{ color: '#22C55E' }}>{loading ? '...' : stats.resolvedReports}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tiempo promedio:</span>
              <strong style={{ color: '#1F6FEB' }}>{loading ? '...' : `${stats.averageResponseTime} días`}</strong>
            </div>
            {stats.lastActivity && (
                <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#F0F9FF', 
                borderRadius: '6px',
                fontSize: '12px',
                color: '#0369A1'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon /> Última actividad: {new Date(stats.lastActivity).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/my-reports')}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Ver Mis Reportes
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/create-report')}
              style={{
                padding: '12px',
                backgroundColor: '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Crear Nuevo Reporte
            </button>
            <button
              onClick={() => navigate('/map')}
              style={{
                padding: '12px',
                backgroundColor: '#1F6FEB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Ver Mapa
            </button>
            <button
              onClick={() => navigate('/guide')}
              style={{
                padding: '12px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Guía Educativa
            </button>
          </div>
        </div>
      </div>
      </div>
    );

  // Dashboard específico para Autoridad
  const AuthorityDashboard = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          Panel de Autoridad
        </h1>
        <p style={{ color: '#6B7280' }}>
          Gestiona reportes y coordina la respuesta a incidentes
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Estadísticas Generales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total reportes:</span>
              <strong>156</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pendientes:</span>
              <strong style={{ color: '#F59E0B' }}>23</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>En proceso:</span>
              <strong style={{ color: '#1F6FEB' }}>45</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Resueltos:</span>
              <strong style={{ color: '#22C55E' }}>88</strong>
            </div>
          </div>
          </div>
          
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/reports')}
              style={{
                padding: '12px',
                backgroundColor: '#1F6FEB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Panel de Reportes
            </button>
            <button
              onClick={() => navigate('/map')}
              style={{
                padding: '12px',
                backgroundColor: '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Mapa con Acciones
            </button>
            <button
              onClick={() => navigate('/create-report')}
              style={{
                padding: '12px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Crear Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard específico para Admin
  const AdminDashboard = () => {
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showProfileImageModal, setShowProfileImageModal] = useState(false);
    const { logout } = useAuth();

    const handleChangePassword = () => {
      setShowChangePasswordModal(true);
    };

    const handleViewTerms = () => {
      setShowTermsModal(true);
    };

    const handleChangeProfileImage = () => {
      setShowProfileImageModal(true);
    };

    const handleLogout = () => {
      if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        logout();
        navigate('/login');
      }
    };

    return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          Panel de Administración
        </h1>
        <p style={{ color: '#6B7280' }}>
          Gestión completa del sistema y supervisión de operaciones
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Estadísticas Globales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total reportes:</span>
              <strong>156</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Usuarios activos:</span>
              <strong>89</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Autoridades:</span>
              <strong>12</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tasa de resolución:</span>
              <strong style={{ color: '#22C55E' }}>78%</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Gestión del Sistema
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/reports')}
              style={{
                padding: '12px',
                backgroundColor: '#1F6FEB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Panel de Reportes
            </button>
            <button
              onClick={() => navigate('/users')}
              style={{
                padding: '12px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Gestión de Usuarios
            </button>
            <button
              onClick={() => navigate('/map')}
              style={{
                padding: '12px',
                backgroundColor: '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Mapa Administrativo
            </button>
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                padding: '12px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Mi Perfil
                </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      {showProfileImageModal && <ProfileImageModal onClose={() => setShowProfileImageModal(false)} />}
      </div>
    );
  };

  // Renderizar dashboard según rol
  const renderDashboard = () => {
    switch (user.role) {
      case 'CITIZEN':
        return <CitizenDashboard />;
      case 'AUTHORITY':
        return <AuthorityDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <CitizenDashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <Navigation />
      {renderDashboard()}
    </div>
  );
};

// Componentes para los modales
const ChangePasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!currentPassword) newErrors.currentPassword = 'Contraseña actual es obligatoria';
    if (!newPassword) newErrors.newPassword = 'Nueva contraseña es obligatoria';
    else if (newPassword.length < 6) newErrors.newPassword = 'Debe tener al menos 6 caracteres';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Contraseña cambiada exitosamente');
      onClose();
    } catch (error) {
      alert('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
          Cambiar Contraseña
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.currentPassword ? '#EF4444' : '#D1D5DB'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {errors.currentPassword && (
                <span style={{ fontSize: '12px', color: '#EF4444' }}>{errors.currentPassword}</span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.newPassword ? '#EF4444' : '#D1D5DB'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {errors.newPassword && (
                <span style={{ fontSize: '12px', color: '#EF4444' }}>{errors.newPassword}</span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.confirmPassword ? '#EF4444' : '#D1D5DB'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {errors.confirmPassword && (
                <span style={{ fontSize: '12px', color: '#EF4444' }}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#6B7280',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#9CA3AF' : '#1F6FEB',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
            Términos y Condiciones - Hydora
          </h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>1. Aceptación de los Términos</h4>
          <p style={{ marginBottom: '16px' }}>
            Al acceder y utilizar la plataforma Hydora, usted acepta estar sujeto a estos términos y condiciones de uso.
          </p>

          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>2. Descripción del Servicio</h4>
          <p style={{ marginBottom: '16px' }}>
            Hydora es una plataforma de gestión ciudadana que permite a los usuarios reportar incidencias y a las autoridades 
            gestionar dichos reportes de manera eficiente.
          </p>

          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>3. Responsabilidades del Usuario</h4>
          <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
            <li>Proporcionar información veraz y actualizada</li>
            <li>No utilizar el servicio para fines ilegales o no autorizados</li>
            <li>Respetar los derechos de otros usuarios</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
          </ul>

          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>4. Privacidad y Protección de Datos</h4>
          <p style={{ marginBottom: '16px' }}>
            Su privacidad es importante para nosotros. Los datos personales se procesan de acuerdo con nuestra 
            Política de Privacidad y las leyes aplicables de protección de datos.
          </p>

          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>5. Limitación de Responsabilidad</h4>
          <p style={{ marginBottom: '16px' }}>
            Hydora no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso 
            o la imposibilidad de usar el servicio.
          </p>

          <h4 style={{ color: '#1F2937', marginBottom: '12px' }}>6. Modificaciones</h4>
          <p style={{ marginBottom: '16px' }}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
            en vigor inmediatamente después de su publicación.
          </p>

          <div style={{
            backgroundColor: '#F0F9FF',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#075985' }}>
              <strong>Última actualización:</strong> Enero 2024<br/>
              <strong>Contacto:</strong> legal@hydora.com
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileImageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      // Simular subida de imagen
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Imagen de perfil actualizada exitosamente');
      onClose();
    } catch (error) {
      alert('Error al actualizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
          Cambiar Foto de Perfil
        </h3>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            overflow: 'hidden',
            border: '2px solid #E5E7EB'
          }}>
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <UsersIcon size={48} />
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: '#F3F4F6',
            border: '2px dashed #D1D5DB',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <span style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DocumentIcon size={16} /> Seleccionar imagen
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '8px' }}>
            Formatos soportados: JPG, PNG, GIF (máx. 5MB)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedImage || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: (!selectedImage || loading) ? '#9CA3AF' : '#22C55E',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: (!selectedImage || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
