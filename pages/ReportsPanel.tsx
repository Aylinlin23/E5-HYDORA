import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { ClipboardIcon, PlusIcon, MapIcon as MapSvg, DocumentIcon, EyeIcon, SearchIcon, CheckIcon, DownloadIcon, MapPinIcon, UsersIcon, PencilIcon, TrashIcon } from '../ui/Icons';
import { reportService } from '../services/api';

interface Report {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  photos?: string[];
  citizenId?: string;
  citizenName?: string;
  citizenPhone?: string;
  assignedTo?: any;
  assignedAuthority?: string;
  estimatedResolution?: string;
  comments?: Comment[];
  user?: any;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  isInternal: boolean;
  createdAt: string;
}

interface Statistics {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  averageResolutionTime: number;
}

interface ReportFilters {
  status: string;
  category: string;
  priority: string;
  dateRange: string;
  assignedTo: string;
  search: string;
}

const ReportsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  
  const [filters, setFilters] = useState<ReportFilters>({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    assignedTo: 'all',
    search: ''
  });

  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    byCategory: {},
    byPriority: {},
    averageResolutionTime: 0
  });

  useEffect(() => {
    loadReports();
  }, [user]);

  useEffect(() => {
    calculateStatistics();
  }, [reports]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Llamada real al backend
      const response = await reportService.getAll();
      
      if (response.success && response.data) {
        // Filtrar reportes según el rol del usuario
        let filteredReports = response.data;
        
        if (user?.role === 'CITIZEN') {
          // Ciudadanos solo ven sus propios reportes
          filteredReports = response.data.filter((report: any) => 
            report.user?.id === user.id || report.citizenId === user.id
          );
        } else if (user?.role === 'AUTHORITY') {
          // Autoridades ven reportes asignados a su área
          filteredReports = response.data.filter((report: any) => 
            report.assignedTo?.id === user.id || 
            report.assignedTo?.name?.includes(user.name || '')
          );
        }
        // Administradores ven todos los reportes (no se filtra)

        setReports(filteredReports as any[]);
      } else {
        console.error('Error loading reports:', response.message);
        setReports([] as any[]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([] as any[]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
      resolved: reports.filter(r => r.status === 'RESOLVED').length,
      closed: reports.filter(r => r.status === 'CLOSED').length,
      byCategory: {},
      byPriority: {},
      averageResolutionTime: 0
    };

    // Calcular estadísticas por categoría
    reports.forEach(report => {
      stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1;
      stats.byPriority[report.priority] = (stats.byPriority[report.priority] || 0) + 1;
    });

    setStatistics(stats);
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesStatus = filters.status === 'all' || report.status === filters.status;
      const matchesCategory = filters.category === 'all' || report.category === filters.category;
      const matchesPriority = filters.priority === 'all' || report.priority === filters.priority;
      const matchesAssigned = filters.assignedTo === 'all' || report.assignedTo === filters.assignedTo;
      
      const matchesSearch = filters.search === '' || 
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.address.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDateRange = filters.dateRange === 'all' || 
        (filters.dateRange === 'today' && new Date(report.createdAt).toDateString() === new Date().toDateString()) ||
        (filters.dateRange === 'week' && new Date(report.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filters.dateRange === 'month' && new Date(report.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

      return matchesStatus && matchesCategory && matchesPriority && matchesAssigned && matchesSearch && matchesDateRange;
    });
  }, [reports, filters]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'IN_PROGRESS': return '#1F6FEB';
      case 'RESOLVED': return '#22C55E';
      case 'CLOSED': return '#6B7280';
      case 'REJECTED': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En Proceso';
      case 'RESOLVED': return 'Resuelto';
      case 'CLOSED': return 'Cerrado';
      case 'REJECTED': return 'Rechazado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#22C55E';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      case 'CRITICAL': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getPriorityDisplayName = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Baja';
      case 'MEDIUM': return 'Media';
      case 'HIGH': return 'Alta';
      case 'CRITICAL': return 'Crítica';
      default: return priority;
    }
  };

  const canEditReport = (report: Report) => {
    if (user?.role === 'ADMIN') return true;
    if (user?.role === 'CITIZEN') {
      return report.citizenId === user.id && !['RESOLVED', 'CLOSED'].includes(report.status);
    }
    return false;
  };

  const canDeleteReport = (report: Report) => {
    if (user?.role === 'ADMIN') return true;
    if (user?.role === 'CITIZEN') {
      return report.citizenId === user.id && report.status === 'PENDING';
    }
    return false;
  };

  const canUpdateStatus = (report: Report) => {
    return user?.role === 'AUTHORITY' || user?.role === 'ADMIN';
  };

  const canReassign = (report: Report) => {
    return user?.role === 'ADMIN';
  };

  const canAddComment = (report: Report) => {
    return user?.role === 'AUTHORITY' || user?.role === 'ADMIN';
  };

  // Event handlers
  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateReport = () => {
    navigate('/create-report');
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      try {
        // Simular eliminación
        await new Promise(resolve => setTimeout(resolve, 500));
        setReports(prev => prev.filter(r => r.id !== reportId));
      } catch (error) {
        console.error('Error eliminando reporte:', error);
      }
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 500));
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: newStatus as any, updatedAt: new Date().toISOString() } : r
      ));
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleViewImages = (images: string[], startIndex: number = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setShowImageModal(true);
  };

  const handleAddComment = (report: Report) => {
    setSelectedReport(report);
    setNewComment('');
    setIsInternalComment(false);
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    if (!selectedReport || !newComment.trim()) return;

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        authorId: user?.id || '',
        authorName: user?.name || '',
        authorRole: user?.role || '',
        isInternal: isInternalComment,
        createdAt: new Date().toISOString()
      };

      setReports(prev => prev.map(r => 
        r.id === selectedReport.id 
          ? { ...r, comments: [...r.comments, comment], updatedAt: new Date().toISOString() }
          : r
      ));

      setShowCommentModal(false);
      setNewComment('');
      setIsInternalComment(false);
    } catch (error) {
      console.error('Error agregando comentario:', error);
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
              Panel de Reportes
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
              {user.role === 'CITIZEN' && 'Gestiona tus reportes enviados'}
              {user.role === 'AUTHORITY' && 'Gestiona reportes asignados a tu área'}
              {user.role === 'ADMIN' && 'Administra todos los reportes del sistema'}
            <div style={{ position: 'relative' }}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            </p>

            {user.role === 'CITIZEN' && (
              <button
                onClick={handleCreateReport}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#22C55E',
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
                <PlusIcon size={16} /> Crear Reporte
              </button>
            )}
            
            <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '8px' }}>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'cards' ? '#1F6FEB' : 'transparent',
                  color: viewMode === 'cards' ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '7px 0 0 7px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <ClipboardIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'table' ? '#1F6FEB' : 'transparent',
                  color: viewMode === 'table' ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '0 7px 7px 0',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {/* tabla icono - usar documento */}
                <DocumentIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>{statistics.total}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Total de Reportes</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#F59E0B' }}>{statistics.pending}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Pendientes</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1F6FEB' }}>{statistics.inProgress}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>En Proceso</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#22C55E' }}>{statistics.resolved}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Resueltos</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Proceso</option>
            <option value="RESOLVED">Resuelto</option>
            <option value="CLOSED">Cerrado</option>
            <option value="REJECTED">Rechazado</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas las categorías</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Vialidad">Vialidad</option>
            <option value="Señalización">Señalización</option>
            <option value="Alumbrado">Alumbrado</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Seguridad">Seguridad</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas las prioridades</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #1F6FEB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6B7280' }}>Cargando reportes...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            {user.role === 'CITIZEN' ? (
              // Vista especial para ciudadanos sin reportes
              <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#22C55E',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <DocumentIcon size={32} />
                </div>
                
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  ¡Bienvenido a Hydora!
                </h2>
                
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  marginBottom: '8px',
                  lineHeight: '1.5'
                }}>
                  Aún no has creado ningún reporte.
                </p>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '32px',
                  lineHeight: '1.5'
                }}>
                  Presiona el botón <strong>+</strong> para comenzar a reportar problemas en tu comunidad y ayudar a mejorarla.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                    <button
                    onClick={handleCreateReport}
                    style={{
                      padding: '16px 32px',
                      backgroundColor: '#22C55E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#16A34A';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(34,197,94,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#22C55E';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.3)';
                    }}
                    >
                    <PlusIcon size={18} />
                    Crear mi primer reporte
                  </button>

                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '16px',
                    fontSize: '12px',
                    color: '#9CA3AF'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span><CheckIcon size={14} /></span>
                      <span>Rápido y fácil</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span><DownloadIcon size={14} /></span>
                      <span>Con fotos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span><DocumentIcon size={14} /></span>
                      <span>Ubicación exacta</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '32px',
                  padding: '16px',
                  backgroundColor: '#F0F9FF',
                  borderRadius: '8px',
                  border: '1px solid #0EA5E9'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#0369A1',
                    margin: 0,
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ClipboardIcon size={14} /> <strong>Tip:</strong> Los reportes que crees serán vistos por las autoridades correspondientes y podrás seguir su progreso en tiempo real.
                  </p>
                </div>
              </div>
            ) : (
              // Vista para autoridades/admins sin reportes (filtros)
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}><SearchIcon size={48} /></div>
                <h3 style={{ fontSize: '18px', color: '#1F2937', marginBottom: '8px' }}>
                  No se encontraron reportes
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                  No hay reportes que coincidan con los filtros seleccionados.
                </p>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  Intenta ajustar los filtros o cambiar el rango de fechas.
                </p>
              </div>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {/* Cards view will be implemented here */}
            {filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                userRole={user.role}
                onEdit={() => handleEditReport(report)}
                onDelete={() => handleDeleteReport(report.id)}
                onUpdateStatus={(status) => handleUpdateStatus(report.id, status)}
                onViewImages={(images, index) => handleViewImages(images, index)}
                onAddComment={() => handleAddComment(report)}
                canEdit={canEditReport(report)}
                canDelete={canDeleteReport(report)}
                canUpdateStatus={canUpdateStatus(report)}
                canAddComment={canAddComment(report)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table view will be implemented here */}
            <ReportsTable
              reports={filteredReports}
              userRole={user.role}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onUpdateStatus={handleUpdateStatus}
              onViewImages={handleViewImages}
              onAddComment={handleAddComment}
              canEdit={canEditReport}
              canDelete={canDeleteReport}
              canUpdateStatus={canUpdateStatus}
              canAddComment={canAddComment}
            />
          </div>
        )}
      </div>

      {/* Modales */}
      {showImageModal && (
        <ImageGalleryModal
          images={selectedImages}
          currentIndex={currentImageIndex}
          onClose={() => setShowImageModal(false)}
          onNavigate={setCurrentImageIndex}
        />
      )}

      {showCommentModal && selectedReport && (
        <CommentModal
          report={selectedReport}
          newComment={newComment}
          isInternal={isInternalComment}
          userRole={user.role}
          onCommentChange={setNewComment}
          onInternalChange={setIsInternalComment}
          onSubmit={handleSubmitComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}

      {showEditModal && selectedReport && (
        <EditReportModal
          report={selectedReport}
          userRole={user.role}
          onSave={(updatedReport) => {
            setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

// ReportCard Component
interface ReportCardProps {
  report: Report;
  userRole: string;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: string) => void;
  onViewImages: (images: string[], index: number) => void;
  onAddComment: () => void;
  canEdit: boolean;
  canDelete: boolean;
  canUpdateStatus: boolean;
  canAddComment: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  userRole,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewImages,
  onAddComment,
  canEdit,
  canDelete,
  canUpdateStatus,
  canAddComment
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'IN_PROGRESS': return '#1F6FEB';
      case 'RESOLVED': return '#22C55E';
      case 'CLOSED': return '#6B7280';
      case 'REJECTED': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En Proceso';
      case 'RESOLVED': return 'Resuelto';
      case 'CLOSED': return 'Cerrado';
      case 'REJECTED': return 'Rechazado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#22C55E';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      case 'CRITICAL': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <div className="card" style={{ padding: '20px', position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
              {report.title}
            </h3>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              ID: {report.id} • {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              padding: '4px 8px',
              backgroundColor: getStatusColor(report.status),
              color: 'white',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {getStatusDisplayName(report.status)}
            </span>
            <span style={{
              padding: '4px 8px',
              backgroundColor: getPriorityColor(report.priority),
              color: 'white',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {report.priority}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 12px 0', lineHeight: '1.4' }}>
          {report.description.length > 100 
            ? `${report.description.substring(0, 100)}...` 
            : report.description}
        </p>

        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPinIcon size={14} /> {report.address}
        </div>

        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <ClipboardIcon size={14} /> {report.category}
          {userRole !== 'CITIZEN' && report.citizenName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• <UsersIcon size={14} /> {report.citizenName}</span>
          )}
          {report.assignedTo && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• <UsersIcon size={14} /> {report.assignedTo}</span>
          )}
        </div>
      </div>

      {/* Images */}
      {report.photos && report.photos.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {report.photos.slice(0, 3).map((photo, index) => (
              <div
                key={index}
                onClick={() => onViewImages(report.photos, index)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '2px solid #E5E7EB'
                }}
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {index === 2 && report.photos.length > 3 && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    +{report.photos.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments indicator */}
      {report.comments && report.comments.length > 0 && (
        <div style={{ marginBottom: '16px', fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PencilIcon size={14} /> {report.comments.length} comentario{report.comments.length !== 1 ? 's' : ''}
          {report.comments.length > 0 && (
            <span> • Último: {new Date(report.comments[report.comments.length - 1].createdAt).toLocaleDateString()}</span>
          )}
        </div>
      )}

      {/* Status Update for Authorities */}
      {canUpdateStatus && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>
            Actualizar estado:
          </label>
          <select
            value={report.status}
            onChange={(e) => onUpdateStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Proceso</option>
            <option value="RESOLVED">Resuelto</option>
            <option value="CLOSED">Cerrado</option>
            {userRole === 'ADMIN' && <option value="REJECTED">Rechazado</option>}
          </select>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.open(`/reports/${report.id}`, '_blank')}
          style={{
            padding: '6px 12px',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <EyeIcon size={14} /> Ver detalles
        </button>

        {canEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <DocumentIcon size={14} /> Editar
          </button>
        )}

        {canAddComment && (
          <button
            onClick={onAddComment}
            style={{
              padding: '6px 12px',
              backgroundColor: '#22C55E',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PencilIcon size={14} /> Comentar
          </button>
        )}

        {canDelete && (
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrashIcon size={14} /> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

// ReportsTable Component will be implemented
const ReportsTable: React.FC<any> = () => <div>Table Component</div>;
// ImageGalleryModal Component
interface ImageGalleryModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
        >
          ×
        </button>

        {/* Image counter */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          color: 'white',
          fontSize: '14px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {currentIndex + 1} de {images.length}
        </div>

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            style={{
              position: 'absolute',
              left: '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ‹
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              position: 'absolute',
              right: '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ›
          </button>
        )}

        {/* Main image */}
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            maxWidth: '100%',
            overflowX: 'auto',
            padding: '8px'
          }}>
            {images.map((image, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(index);
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: index === currentIndex ? '3px solid white' : '3px solid transparent',
                  opacity: index === currentIndex ? 1 : 0.7,
                  flexShrink: 0
                }}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// CommentModal Component
interface CommentModalProps {
  report: Report;
  newComment: string;
  isInternal: boolean;
  userRole: string;
  onCommentChange: (comment: string) => void;
  onInternalChange: (isInternal: boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  report,
  newComment,
  isInternal,
  userRole,
  onCommentChange,
  onInternalChange,
  onSubmit,
  onClose
}) => {
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Comentarios - {report.title}
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

        {/* Existing Comments */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
            Historial de Comentarios ({report.comments.length})
          </h4>
          
          {report.comments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              color: '#6B7280'
            }}>
              No hay comentarios aún
            </div>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {report.comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: comment.isInternal ? '#FEF3C7' : '#F3F4F6',
                    borderRadius: '8px',
                    borderLeft: comment.isInternal ? '4px solid #F59E0B' : '4px solid #1F6FEB'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                      {comment.authorName}
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        backgroundColor: comment.authorRole === 'ADMIN' ? '#DC2626' : comment.authorRole === 'AUTHORITY' ? '#F59E0B' : '#22C55E',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        {comment.authorRole === 'ADMIN' ? 'Admin' : comment.authorRole === 'AUTHORITY' ? 'Autoridad' : 'Ciudadano'}
                      </span>
                      {comment.isInternal && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#F59E0B',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          Interno
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Comment Form */}
        <div style={{
          padding: '20px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
            Agregar Comentario
          </h4>

          <textarea
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />

          {userRole === 'ADMIN' && (
            <div style={{ marginTop: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => onInternalChange(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Comentario interno (solo visible para administradores y autoridades)</span>
              </label>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#6B7280',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={!newComment.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: !newComment.trim() ? '#9CA3AF' : '#22C55E',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: !newComment.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Agregar Comentario
            </button>
          </div>

          {userRole === 'AUTHORITY' && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#DBEAFE',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ClipboardIcon size={14} /> Tip: Los comentarios que agregues serán visibles para el ciudadano que creó el reporte
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// EditReportModal Component (Simple version)
interface EditReportModalProps {
  report: Report;
  userRole: string;
  onSave: (report: Report) => void;
  onClose: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ report, userRole, onSave, onClose }) => {
  const [title, setTitle] = useState(report.title);
  const [description, setDescription] = useState(report.description);
  const [category, setCategory] = useState(report.category);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>(report.priority);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReport = {
        ...report,
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority as any,
        updatedAt: new Date().toISOString()
      };
      
      onSave(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
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
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
          Editar Reporte
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Descripción *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="Infraestructura">Infraestructura</option>
              <option value="Vialidad">Vialidad</option>
              <option value="Señalización">Señalización</option>
              <option value="Alumbrado">Alumbrado</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Seguridad">Seguridad</option>
            </select>
          </div>

          {userRole === 'ADMIN' && (
            <div>
              <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px',
          justifyContent: 'flex-end'
        }}>
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
            disabled={loading || !title.trim() || !description.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: (loading || !title.trim() || !description.trim()) ? '#9CA3AF' : '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: (loading || !title.trim() || !description.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;