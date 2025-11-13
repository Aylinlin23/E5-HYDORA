import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { ClipboardIcon, DocumentIcon, MapIcon, LogoutIcon, PencilIcon, CalendarIcon } from '../ui/Icons';
import { useStats } from '../store/StatsContext';
import { authService } from '../services/api';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  averageResponseTime: number;
  lastActivity: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { stats, loading, refreshStats } = useStats();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    refreshStats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 500));
      setEditMode(false);
      // Aquí se actualizaría el perfil en el backend
    } catch (error) {
      console.error('Error guardando perfil:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'authority': return 'Autoridad';
      case 'citizen': return 'Ciudadano';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#DC2626';
      case 'authority': return '#F59E0B';
      case 'citizen': return '#22C55E';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
          <p style={{ color: '#6B7280' }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '16px 24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(31,41,55,0.08)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Volver
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
              Mi Perfil
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Gestiona tu información personal y configuración
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="button"
              >
                Guardar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PencilIcon /> Editar
            </button>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Información Personal */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '24px'
          }}>
            Información Personal
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1F6FEB',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: '600'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '4px'
              }}>
                {user?.name || 'Usuario'}
              </h4>
              <span style={{
                padding: '4px 12px',
                backgroundColor: getRoleColor(user?.role || 'citizen'),
                color: 'white',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getRoleDisplayName(user?.role || 'citizen')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Nombre Completo
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#1F2937' }}>
                  {user?.name || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#1F2937' }}>
                  {user?.email || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Teléfono
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#1F2937' }}>
                  {user?.phone || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Dirección
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#1F2937' }}>
                  {user?.address || 'No especificada'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '24px'
          }}>
            Mis Estadísticas
            </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '4px'
              }}>
                {stats.totalReports}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Total Reportes
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#F59E0B',
                marginBottom: '4px'
              }}>
                {stats.pendingReports}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Pendientes
              </p>
              </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#22C55E',
                marginBottom: '4px'
              }}>
                {stats.resolvedReports}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Resueltos
              </p>
              </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1F6FEB',
                marginBottom: '4px'
              }}>
                {stats.averageResponseTime}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Días Promedio
              </p>
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#F0F9FF',
            borderRadius: '8px',
            border: '1px solid #0EA5E9'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#0EA5E9',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon /> Última actividad</span>
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6B7280'
            }}>
              {new Date(stats.lastActivity).toLocaleString()}
            </p>
                      </div>
                    </div>
                  </div>

      {/* Configuración y Acciones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        maxWidth: '1200px',
        margin: '24px auto 0'
      }}>
        {/* Configuración */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '24px'
          }}>
            Configuración
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '4px'
                }}>
                  Notificaciones por Email
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  Recibe actualizaciones de tus reportes
                </p>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#1F6FEB',
                  borderRadius: '24px',
                  transition: '0.4s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.4s',
                    transform: 'translateX(20px)'
                  }}></span>
                </span>
              </label>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '4px'
                }}>
                  Notificaciones Push
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  Alertas en tiempo real
                </p>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#1F6FEB',
                  borderRadius: '24px',
                  transition: '0.4s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.4s',
                    transform: 'translateX(20px)'
                  }}></span>
                </span>
              </label>
              </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '4px'
                }}>
                  Modo Oscuro
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  Cambiar tema de la aplicación
                </p>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#D1D5DB',
                  borderRadius: '24px',
                  transition: '0.4s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.4s'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '24px'
          }}>
            Acciones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <button
              onClick={() => navigate('/my-reports')}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1F6FEB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <ClipboardIcon size={16} /> Ver Mis Reportes
            </button>

            <button
              onClick={() => navigate('/create-report')}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <DocumentIcon size={16} /> Crear Nuevo Reporte
            </button>

            <button
              onClick={() => navigate('/map')}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <MapIcon size={16} /> Ver Mapa
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <LogoutIcon size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
