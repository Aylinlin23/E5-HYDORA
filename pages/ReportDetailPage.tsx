import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { MapPinIcon, CalendarIcon, PencilIcon } from '../ui/Icons';

interface ReportDetail {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  photos: string[];
  assignedTo?: string;
  estimatedResolution?: string;
  history: {
    id: string;
    action: string;
    description: string;
    timestamp: string;
    user: string;
  }[];
  comments: {
    id: string;
    user: string;
    message: string;
    timestamp: string;
  }[];
}

const ReportDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'comments'>('details');

  useEffect(() => {
    if (id) {
      loadReportDetail(id);
    }
  }, [id]);

  const loadReportDetail = async (reportId: string) => {
    setLoading(true);
    try {
      // Simular carga del detalle del reporte
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReport: ReportDetail = {
        id: reportId,
        title: 'Fuga de agua en la esquina de Reforma y Juárez',
        description: 'Hay una fuga importante en la esquina de Reforma y Juárez. El agua está corriendo por la calle y ya está afectando el tránsito vehicular. Se puede ver claramente que el agua viene de una tubería rota en el subsuelo.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        address: 'Reforma y Juárez, Centro, CDMX',
        latitude: 19.4326,
        longitude: -99.1332,
        createdAt: '2024-08-02T10:30:00Z',
        updatedAt: '2024-08-02T15:45:00Z',
        photos: [
          'https://via.placeholder.com/400x300/1F6FEB/FFFFFF?text=Foto+1',
          'https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Foto+2'
        ],
        assignedTo: 'Equipo de Mantenimiento Zona Centro',
        estimatedResolution: '2024-08-05T18:00:00Z',
        history: [
          {
            id: '1',
            action: 'CREATED',
            description: 'Reporte creado por ciudadano',
            timestamp: '2024-08-02T10:30:00Z',
            user: 'Juan Pérez'
          },
          {
            id: '2',
            action: 'ASSIGNED',
            description: 'Asignado al equipo de mantenimiento',
            timestamp: '2024-08-02T11:15:00Z',
            user: 'María González'
          },
          {
            id: '3',
            action: 'STATUS_CHANGED',
            description: 'Estado cambiado a En Proceso',
            timestamp: '2024-08-02T15:45:00Z',
            user: 'Carlos Rodríguez'
          }
        ],
        comments: [
          {
            id: '1',
            user: 'Juan Pérez',
            message: 'La fuga parece ser más grave de lo que pensaba inicialmente. El agua está llegando hasta la acera.',
            timestamp: '2024-08-02T10:35:00Z'
          },
          {
            id: '2',
            user: 'María González',
            message: 'Equipo asignado. Llegaremos en las próximas 2 horas para evaluar la situación.',
            timestamp: '2024-08-02T11:20:00Z'
          },
          {
            id: '3',
            user: 'Carlos Rodríguez',
            message: 'Hemos identificado el problema. Es una tubería principal de 8 pulgadas. Necesitaremos cerrar el tránsito temporalmente.',
            timestamp: '2024-08-02T15:50:00Z'
          }
        ]
      };
      
      setReport(mockReport);
    } catch (error) {
      console.error('Error cargando detalle del reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'IN_PROGRESS': return '#1F6FEB';
      case 'RESOLVED': return '#22C55E';
      case 'REJECTED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En Proceso';
      case 'RESOLVED': return 'Resuelto';
      case 'REJECTED': return 'Rechazado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#22C55E';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      case 'URGENT': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getPriorityDisplayName = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Baja';
      case 'MEDIUM': return 'Media';
      case 'HIGH': return 'Alta';
      case 'URGENT': return 'Urgente';
      default: return priority;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Simular envío de comentario
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment = {
        id: Date.now().toString(),
        user: user?.name || 'Usuario',
        message: newComment,
        timestamp: new Date().toISOString()
      };

      setReport(prev => prev ? {
        ...prev,
        comments: [...prev.comments, comment]
      } : null);

      setNewComment('');
    } catch (error) {
      console.error('Error agregando comentario:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Simular cambio de estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReport(prev => prev ? {
        ...prev,
        status: newStatus as any,
        updatedAt: new Date().toISOString(),
        history: [...prev.history, {
          id: Date.now().toString(),
          action: 'STATUS_CHANGED',
          description: `Estado cambiado a ${getStatusDisplayName(newStatus)}`,
          timestamp: new Date().toISOString(),
          user: user?.name || 'Usuario'
        }]
      } : null);
    } catch (error) {
      console.error('Error cambiando estado:', error);
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
          <p style={{ color: '#6B7280' }}>Cargando reporte...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h2 style={{ marginBottom: '16px' }}>Reporte no encontrado</h2>
          <p style={{ marginBottom: '24px', color: '#6B7280' }}>
            El reporte que buscas no existe o ha sido eliminado.
              </p>
              <button
            onClick={() => navigate('/my-reports')}
            className="button"
              >
            Volver a Mis Reportes
              </button>
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
            onClick={() => navigate('/my-reports')}
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
                  Detalle del Reporte
                </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              #{report.id} • {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {user?.role === 'AUTHORITY' || user?.role === 'ADMIN' ? (
            <select
              value={report.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Proceso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="REJECTED">Rechazado</option>
            </select>
          ) : null}
          
                  <button
                    onClick={() => navigate(`/reports/${report.id}/edit`)}
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
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Contenido principal */}
        <div>
          {/* Información básica */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {report.title}
              </h2>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getStatusColor(report.status),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getStatusDisplayName(report.status)}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getPriorityColor(report.priority),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getPriorityDisplayName(report.priority)}
              </span>
              </div>
            
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              {report.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPinIcon />
                {report.address}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarIcon />
                {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Fotos */}
          {report.photos.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '16px'
              }}>
                Fotos del Reporte
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {report.photos.map((photo, index) => (
                  <div key={index} style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="card">
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E5E7EB',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setActiveTab('details')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === 'details' ? '#1F6FEB' : 'transparent',
                  color: activeTab === 'details' ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Detalles
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === 'history' ? '#1F6FEB' : 'transparent',
                  color: activeTab === 'history' ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Historial
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === 'comments' ? '#1F6FEB' : 'transparent',
                  color: activeTab === 'comments' ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Comentarios ({report.comments.length})
              </button>
            </div>

            {/* Contenido de tabs */}
            {activeTab === 'details' && (
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px'
                }}>
                  Información Adicional
                </h4>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Asignado a
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1F2937'
                    }}>
                      {report.assignedTo || 'Sin asignar'}
                    </p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Resolución estimada
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1F2937'
                    }}>
                      {report.estimatedResolution 
                        ? new Date(report.estimatedResolution).toLocaleDateString()
                        : 'No especificada'
                      }
                    </p>
                  </div>
                  
                    <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Coordenadas
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1F2937'
                    }}>
                      {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
              </div>
            )}
                  
            {activeTab === 'history' && (
                    <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px'
                }}>
                  Historial de Cambios
                      </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {report.history.map((item) => (
                    <div key={item.id} style={{
                      padding: '12px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1F2937'
                        }}>
                          {item.description}
                        </p>
                        <span style={{
                          fontSize: '12px',
                          color: '#9CA3AF'
                        }}>
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        Por: {item.user}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
                    
            {activeTab === 'comments' && (
                    <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px'
                }}>
                  Comentarios
                      </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {report.comments.map((comment) => (
                    <div key={comment.id} style={{
                      padding: '16px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1F2937'
                        }}>
                          {comment.user}
                        </p>
                        <span style={{
                          fontSize: '12px',
                          color: '#9CA3AF'
                        }}>
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        lineHeight: '1.5'
                      }}>
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Nuevo comentario */}
                <div>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '12px'
                  }}>
                    Agregar Comentario
                  </h5>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      style={{
                        flex: '1',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: newComment.trim() ? '#1F6FEB' : '#D1D5DB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                        alignSelf: 'flex-end'
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Estado y acciones */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              Estado y Acciones
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                border: '1px solid #0EA5E9'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#0EA5E9',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Estado Actual
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  {getStatusDisplayName(report.status)}
                </p>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                border: '1px solid #F59E0B'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#F59E0B',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Prioridad
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  {getPriorityDisplayName(report.priority)}
                </p>
              </div>
            </div>
          </div>

          {/* Información del reporte */}
          <div className="card">
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              Información del Reporte
                </h3>
                
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                      ID del Reporte
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  #{report.id}
                    </p>
                  </div>
                  
                  <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  Creado
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  Última actualización
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  {new Date(report.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
              
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  Fotos
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  {report.photos.length} foto{report.photos.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage; 
