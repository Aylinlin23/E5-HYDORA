import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { SearchIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, MapPinIcon, CalendarIcon, WarningIcon, CheckIcon, DownloadIcon, UsersIcon, MapSvg, DocumentIcon } from '../ui/Icons';

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
  citizenName?: string;
  citizenPhone?: string;
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
  byPriority: Record<string, number>;
  averageResolutionTime: number;
}

const AuthorityReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    byCategory: {},
    byPriority: {},
    averageResolutionTime: 0
  });
  const [showMap, setShowMap] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showInternalComment, setShowInternalComment] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [reports]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Simular carga de reportes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Fuga de agua en la esquina de Reforma',
          description: 'Hay una fuga importante en la esquina de Reforma y Juárez, el agua está corriendo por la calle.',
          category: 'Fuga de Agua',
          status: 'PENDING',
          priority: 'HIGH',
          address: 'Reforma y Juárez, Centro',
          latitude: 19.4326,
          longitude: -99.1332,
          createdAt: '2024-08-02T10:30:00Z',
          updatedAt: '2024-08-02T10:30:00Z',
          createdBy: '1',
          jurisdiction: 'Centro',
          citizenName: 'María González',
          citizenPhone: '555-0123',
          comments: [
            {
              id: '1',
              text: 'Reporte recibido, se asignará equipo técnico',
              author: 'Autoridad Local',
              authorRole: 'AUTHORITY',
              createdAt: '2024-08-02T11:00:00Z',
              isInternal: false
            },
            {
              id: '2',
              text: 'Equipo técnico disponible mañana a las 8:00 AM',
              author: 'Supervisor Técnico',
              authorRole: 'AUTHORITY',
              createdAt: '2024-08-02T14:30:00Z',
              isInternal: true
            }
          ]
        },
        {
          id: '2',
          title: 'Desbordamiento de alcantarilla',
          description: 'La alcantarilla está desbordándose y hay agua estancada en la calle.',
          category: 'Alcantarillado',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          address: 'Av. Insurgentes 123',
          latitude: 19.4200,
          longitude: -99.1500,
          createdAt: '2024-08-01T15:45:00Z',
          updatedAt: '2024-08-02T09:15:00Z',
          createdBy: '2',
          assignedTo: 'Equipo de Emergencias',
          jurisdiction: 'Insurgentes',
          citizenName: 'Carlos Rodríguez',
          citizenPhone: '555-0456',
          comments: [
            {
              id: '3',
              text: 'Equipo de emergencias en camino',
              author: 'Autoridad Local',
              authorRole: 'AUTHORITY',
              createdAt: '2024-08-01T16:00:00Z',
              isInternal: false
            }
          ]
        },
        {
          id: '3',
          title: 'Fuga menor en parque',
          description: 'Pequeña fuga en el sistema de riego del parque.',
          category: 'Riego',
          status: 'RESOLVED',
          priority: 'LOW',
          address: 'Parque Central',
          latitude: 19.4400,
          longitude: -99.1200,
          createdAt: '2024-07-30T08:20:00Z',
          updatedAt: '2024-08-01T14:30:00Z',
          createdBy: '3',
          assignedTo: 'Mantenimiento',
          jurisdiction: 'Centro',
          citizenName: 'Ana López',
          citizenPhone: '555-0789',
          comments: [
            {
              id: '4',
              text: 'Fuga reparada, sistema funcionando correctamente',
              author: 'Técnico Mantenimiento',
              authorRole: 'AUTHORITY',
              createdAt: '2024-08-01T14:30:00Z',
              isInternal: false
            }
          ]
        }
      ];
      
      // Filtrar reportes por jurisdicción de la autoridad
      const filteredReports = mockReports.filter(report => 
        report.jurisdiction === user?.jurisdiction || !report.jurisdiction
      );
      
      setReports(filteredReports);
    } catch (error) {
      console.error('Error cargando reportes:', error);
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
      byCategory: {},
      byPriority: {},
      averageResolutionTime: 0
    };

    reports.forEach(report => {
      stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1;
      stats.byPriority[report.priority] = (stats.byPriority[report.priority] || 0) + 1;
    });

    // Calcular tiempo promedio de resolución
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED');
    if (resolvedReports.length > 0) {
      const totalTime = resolvedReports.reduce((acc, report) => {
        const created = new Date(report.createdAt).getTime();
        const resolved = new Date(report.updatedAt).getTime();
        return acc + (resolved - created);
      }, 0);
      stats.averageResolutionTime = totalTime / resolvedReports.length / (1000 * 60 * 60); // en horas
    }

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
    const matchesPriorityFilter = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesDateFilter = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(report.createdAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(report.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && new Date(report.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.citizenName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatusFilter && matchesCategoryFilter && matchesPriorityFilter && matchesDateFilter && matchesSearch;
  });

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
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

  const handleAddComment = async (reportId: string) => {
    if (!newComment.trim()) return;

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: user?.name || 'Autoridad',
        authorRole: 'AUTHORITY',
        createdAt: new Date().toISOString(),
        isInternal: showInternalComment
      };

      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, comments: [...(r.comments || []), comment] }
          : r
      ));

      setNewComment('');
      setShowInternalComment(false);
    } catch (error) {
      console.error('Error agregando comentario:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Título', 'Categoría', 'Estado', 'Prioridad', 'Dirección', 'Ciudadano', 'Teléfono', 'Fecha Creación', 'Asignado a'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        report.id,
        `"${report.title}"`,
        report.category,
        getStatusDisplayName(report.status),
        getPriorityDisplayName(report.priority),
        `"${report.address}"`,
        report.citizenName || 'N/A',
        report.citizenPhone || 'N/A',
        new Date(report.createdAt).toLocaleDateString(),
        report.assignedTo || 'Sin asignar'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reportes_autoridad_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
              fontSize: '20px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
              Panel de Autoridad
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Gestión de reportes en tu jurisdicción: {user?.jurisdiction || 'General'}
            </p>
          </div>
            </div>
            
        <div style={{ display: 'flex', gap: '12px' }}>
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
            </div>
          </div>

      {/* Estadísticas detalladas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            Total Reportes
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

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
            Tiempo Promedio
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>
            {statistics.averageResolutionTime.toFixed(1)}h
          </p>
        </div>
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
                placeholder="Buscar reportes, ciudadanos..."
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="all">Todas las prioridades</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
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

      {/* Vista de Mapa */}
      {showMap && (
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
              <p style={{ fontSize: '14px' }}>Mostrando {filteredReports.length} reportes en tu jurisdicción</p>
              </div>
          </div>
        </div>
      )}

      {/* Lista de reportes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredReports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <WarningIcon />
            <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '8px' }}>
              {searchTerm || filter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || dateFilter !== 'all'
                ? 'No se encontraron reportes' 
                : 'No hay reportes en tu jurisdicción'
              }
            </p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              {searchTerm || filter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || dateFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Los reportes aparecerán aquí cuando sean creados por ciudadanos'
              }
            </p>
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
                    flexWrap: 'wrap',
                    marginBottom: '8px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPinIcon />
                      {report.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CalendarIcon />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <UsersIcon />
                      {report.citizenName} - {report.citizenPhone}
                    </span>
                    {report.assignedTo && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UsersIcon />
                        Asignado a: {report.assignedTo}
                      </span>
                    )}
                  </div>

                  {/* Comentarios */}
                  {report.comments && report.comments.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <button
                        onClick={() => setShowComments(showComments === report.id ? null : report.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1F6FEB',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <DocumentIcon />
                        {report.comments.length} comentario{report.comments.length !== 1 ? 's' : ''}
                      </button>
                      
                      {showComments === report.id && (
                        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                          {report.comments.map(comment => (
                            <div key={comment.id} style={{ marginBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                                  {comment.author}
                                </span>
                                <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                                {comment.text}
                              </p>
                              {comment.isInternal && (
                                <span style={{ fontSize: '10px', color: '#F59E0B', fontStyle: 'italic' }}>
                                  Comentario interno
                                </span>
                              )}
                            </div>
                          ))}
                          
                          {/* Nuevo comentario */}
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Agregar comentario..."
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '4px',
                                fontSize: '12px',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                              <label style={{ fontSize: '11px', color: '#6B7280' }}>
                                <input
                                  type="checkbox"
                                  checked={showInternalComment}
                                  onChange={(e) => setShowInternalComment(e.target.checked)}
                                  style={{ marginRight: '4px' }}
                                />
                                Comentario interno
                              </label>
                              <button
                                onClick={() => handleAddComment(report.id)}
                                disabled={!newComment.trim()}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: newComment.trim() ? '#1F6FEB' : '#E5E7EB',
                                  color: newComment.trim() ? 'white' : '#9CA3AF',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                                }}
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                    <option value="Equipo Técnico">Equipo Técnico</option>
                    <option value="Equipo de Emergencias">Equipo de Emergencias</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorityReportsPage; 
