import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Layout from '../components/Layout';
import { reportService } from '../services/api';
import { SearchIcon, PlusIcon, EyeIcon, PencilIcon, ClipboardIcon, MapIcon as MapSvg, CalendarIcon, DocumentIcon, LocationIcon, DownloadIcon, CheckIcon, WarningIcon, TrashIcon, UsersIcon, MapPinIcon } from '../ui/Icons';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  photos?: string[];
  assignedTo?: string;
  comments?: Comment[];
  createdBy: string;
  jurisdiction?: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  createdAt: string;
  isInternal: boolean;
}

interface Statistics {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byCategory: Record<string, number>;
}

const MyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    byCategory: {}
  });
  const [showMap, setShowMap] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [reports]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Llamada al nuevo endpoint para obtener reportes del usuario
      const response = await reportService.getUserReports();
      
      if (response.success && response.data) {
        // El backend devuelve { data: { reports: [], pagination: {} } }
        // pero el servicio puede devolver diferentes estructuras
        let reportsData: any[] = [];
        
        if (Array.isArray(response.data)) {
          // Si response.data es directamente un array
          reportsData = response.data;
        } else if ((response.data as any).reports && Array.isArray((response.data as any).reports)) {
          // Si response.data tiene una propiedad reports
          reportsData = (response.data as any).reports;
        } else if ((response as any).reports && Array.isArray((response as any).reports)) {
          // Si la respuesta tiene reports en el nivel superior
          reportsData = (response as any).reports;
        }
        
        setReports(reportsData);
      } else {
        console.error('Error cargando reportes:', response.message);
        setReports([]);
      }
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    const stats: Statistics = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
      resolved: reports.filter(r => r.status === 'RESOLVED').length,
      byCategory: {}
    };

    reports.forEach(report => {
      stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1;
    });

    setStatistics(stats);
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

  const filteredReports = reports.filter(report => {
    const matchesStatusFilter = filter === 'all' || report.status === filter;
    const matchesCategoryFilter = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesDateFilter = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(report.createdAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(report.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && new Date(report.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatusFilter && matchesCategoryFilter && matchesDateFilter && matchesSearch;
  });

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/reports/${reportId}/edit`);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
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

  const handleAssignReport = async (reportId: string, assignedTo: string) => {
    try {
      // Simular asignación
      await new Promise(resolve => setTimeout(resolve, 500));
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, assignedTo, updatedAt: new Date().toISOString() } : r
      ));
    } catch (error) {
      console.error('Error asignando reporte:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Título', 'Categoría', 'Estado', 'Prioridad', 'Dirección', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        report.id,
        `"${report.title}"`,
        report.category,
        getStatusDisplayName(report.status),
        getPriorityDisplayName(report.priority),
        `"${report.address}"`,
        new Date(report.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reportes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const canEditReport = (report: Report) => {
    if (user?.role === 'CITIZEN') {
      return report.createdBy === user.id && report.status === 'PENDING';
    }
    return user?.role === 'ADMIN' || user?.role === 'AUTHORITY';
  };

  const canDeleteReport = (report: Report) => {
    if (user?.role === 'CITIZEN') {
      return report.createdBy === user.id && report.status === 'PENDING';
    }
    return user?.role === 'ADMIN';
  };

  const canUpdateStatus = (report: Report) => {
    return user?.role === 'AUTHORITY' || user?.role === 'ADMIN';
  };

  const canAssignReport = (report: Report) => {
    return user?.role === 'ADMIN';
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
          <p style={{ color: '#6B7280' }}>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div style={{
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
              fontSize: '20px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
              {user?.role === 'CITIZEN' ? 'Mis Reportes' : 'Panel de Reportes'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              {user?.role === 'CITIZEN' 
                ? 'Gestiona todos tus reportes de fugas de agua'
                : user?.role === 'AUTHORITY'
                ? 'Gestiona reportes de tu jurisdicción'
                : 'Administra todos los reportes del sistema'
              }
                </p>
              </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {(user?.role === 'AUTHORITY' || user?.role === 'ADMIN') && (
            <button
              onClick={() => setShowMap(!showMap)}
              style={{
                padding: '8px 16px',
                backgroundColor: showMap ? '#1F6FEB' : '#F3F4F6',
                color: showMap ? 'white' : '#374151',
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
              <MapSvg />
              {showMap ? 'Vista Tabla' : 'Vista Mapa'}
            </button>
          )}
          
          {user?.role === 'ADMIN' && (
            <button
              onClick={exportToCSV}
              style={{
                padding: '8px 16px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
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
              <DownloadIcon />
              Exportar CSV
            </button>
          )}
          
              <button
            onClick={() => navigate('/create-report')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1F6FEB',
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
      <PlusIcon />
        Nuevo Reporte
              </button>
            </div>
          </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            Total
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>
            {statistics.total}
          </p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            Pendientes
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B' }}>
            {statistics.pending}
          </p>
          </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            En Proceso
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#1F6FEB' }}>
            {statistics.inProgress}
          </p>
              </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            Resueltos
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#22C55E' }}>
            {statistics.resolved}
          </p>
              </div>

        {user?.role === 'ADMIN' && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
              Categorías
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>
              {Object.keys(statistics.byCategory).length}
            </p>
              </div>
        )}
              </div>

      {/* Filtros avanzados */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="IN_PROGRESS">En Proceso</option>
            <option value="RESOLVED">Resueltos</option>
            <option value="REJECTED">Rechazados</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="all">Todas las categorías</option>
            <option value="Fuga de Agua">Fuga de Agua</option>
            <option value="Alcantarillado">Alcantarillado</option>
            <option value="Riego">Riego</option>
            <option value="Infraestructura">Infraestructura</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
        </div>
      </div>

      {/* Vista de Mapa (solo para autoridades y admin) */}
      {showMap && (user?.role === 'AUTHORITY' || user?.role === 'ADMIN') && (
        <div className="card" style={{ marginBottom: '24px', height: '400px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            color: '#6B7280'
          }}>
            <div style={{ textAlign: 'center' }}>
              <MapSvg />
              <p>Mapa interactivo de reportes</p>
              <p style={{ fontSize: '14px' }}>Mostrando {filteredReports.length} reportes</p>
            </div>
          </div>
        </div>
      )}

          {/* Lista de reportes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            {searchTerm || filter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' ? (
              // Vista para cuando hay filtros aplicados
              <div className="card" style={{ padding: '48px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}><SearchIcon size={48} /></div>
                <h3 style={{ fontSize: '18px', color: '#1F2937', marginBottom: '8px' }}>
                  No se encontraron reportes
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                  No hay reportes que coincidan con los filtros seleccionados.
                </p>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            ) : (
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
                  ¡Comenzemos!
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
                  Presiona el botón <strong>+</strong> para reportar tu primer problema y ayudar a mejorar tu comunidad.
                </p>

                  <button
                  onClick={() => navigate('/create-report')}
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
                    margin: '0 auto',
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
                  <PlusIcon size={20} />
                  Crear mi primer reporte
                  </button>

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
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    <SearchIcon size={16} /> <strong>Tip:</strong> Puedes reportar fugas de agua, baches, alumbrado dañado, problemas de señalización y más.
                  </p>
                </div>
                </div>
              )}
            </div>
          ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ flex: '1' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1F2937',
                      margin: 0
                    }}>
                      {report.title}
                    </h3>
                    
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getStatusColor(report.status),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {report.status === 'PENDING' ? <CalendarIcon /> : 
                       report.status === 'IN_PROGRESS' ? <WarningIcon /> : 
                       report.status === 'RESOLVED' ? <CheckIcon /> : <WarningIcon />}
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

                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {report.category}
                    </span>
                        </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    marginBottom: '8px',
                    lineHeight: '1.5'
                  }}>
                    {report.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    color: '#9CA3AF',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPinIcon />
                      {report.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CalendarIcon />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {report.assignedTo && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UsersIcon />
                        Asignado a: {report.assignedTo}
                      </span>
                    )}
                          </div>
                        </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '120px'
                }}>
                          <button
                    onClick={() => handleViewReport(report.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#1F6FEB',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <EyeIcon />
                    Ver
                          </button>
                  
                  {canEditReport(report) && (
                          <button
                      onClick={() => handleEditReport(report.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#F59E0B',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <PencilIcon />
                            Editar
                          </button>
                  )}
                  
                  {canUpdateStatus(report) && (
                    <select
                      value={report.status}
                      onChange={(e) => handleUpdateStatus(report.id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '11px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="IN_PROGRESS">En Proceso</option>
                      <option value="RESOLVED">Resuelto</option>
                      <option value="REJECTED">Rechazado</option>
                    </select>
                  )}
                  
                  {canAssignReport(report) && (
                    <select
                      value={report.assignedTo || ''}
                      onChange={(e) => handleAssignReport(report.id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '11px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Sin asignar</option>
                      <option value="Autoridad Local">Autoridad Local</option>
                      <option value="Equipo Técnico">Equipo Técnico</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  )}
                  
                  {canDeleteReport(report) && (
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <TrashIcon />
                            Eliminar
                          </button>
                  )}
                </div>
            </div>
            </div>
          ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyReportsPage; 
