import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { reportService } from '../services/api';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useFilters from '../hooks/useFilters';
import MainNavigation from '../components/MainNavigation';
import AdvancedFilters from '../components/AdvancedFilters';
import InfiniteScroll from '../components/InfiniteScroll';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthorityPanelPageInfinite: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Filtros con persistencia en URL
  const { filters, updateFilters, resetFilters, getFilterValue, setFilterValue } = useFilters({
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    lat: '',
    lng: '',
    radius: ''
  });

  // Infinite scroll hook
  const {
    reports,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    updateFilters: updateInfiniteFilters
  } = useInfiniteScroll(filters);

  // Sincronizar filtros entre hooks
  useEffect(() => {
    updateInfiniteFilters(filters);
  }, [filters, updateInfiniteFilters]);

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleResetFilters = (resetFilters) => {
    updateFilters(resetFilters);
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      const response = await reportService.updateStatus(reportId, newStatus);
      
      if (response.success) {
        // Actualizar el reporte en la lista
        const updatedReports = reports.map(report => 
          report.id === reportId 
            ? { ...report, status: newStatus }
            : report
        );
        
        // Refrescar la lista completa para obtener datos actualizados
        refresh(filters);
        
        setShowStatusModal(false);
        setSelectedReport(null);
        alert('Estado actualizado exitosamente');
      } else {
        alert(response.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error de conexiÃ³n. Verifica tu conexiÃ³n a internet.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'RESOLVED':
        return 'Resuelto';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityDisplayName = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'Baja';
      case 'MEDIUM':
        return 'Media';
      case 'HIGH':
        return 'Alta';
      case 'URGENT':
        return 'Urgente';
      default:
        return priority;
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MainNavigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Panel de Autoridad
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Gestiona todos los reportes de fugas de agua
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/map')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ver Mapa
                </button>
                <button
                  onClick={() => navigate('/reports/stats')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  EstadÃ­sticas
                </button>
              </div>
            </div>
          </div>

          {/* Filtros avanzados */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            showGeographic={true}
            showSearch={true}
            className="mb-6"
          />

          {/* EstadÃ­sticas rÃ¡pidas */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {reports.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Reportes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {reports.filter(r => r.status === 'PENDING').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {reports.filter(r => r.status === 'IN_PROGRESS').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">En Progreso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {reports.filter(r => r.status === 'RESOLVED').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Resueltos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {reports.filter(r => r.status === 'REJECTED').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rechazados</p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error al cargar reportes
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => refresh(filters)}
                      className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de reportes con infinite scroll */}
          <InfiniteScroll
            onLoadMore={loadMore}
            hasMore={hasMore}
            loading={loading}
            className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
          >
            {reports.length === 0 && !loading ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay reportes</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {Object.values(filters).some(v => v && v !== 'all') 
                    ? 'No se encontraron reportes con los filtros aplicados.'
                    : 'No hay reportes en el sistema.'
                  }
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <li key={report.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                {report.title}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                  {getStatusDisplayName(report.status)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                                  {getPriorityDisplayName(report.priority)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {report.address || 'Sin direcciÃ³n'}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {report.user?.name || 'Usuario desconocido'}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-4">
                              <button
                                onClick={() => navigate(`/reports/${report.id}`)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                              >
                                Ver detalle
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowStatusModal(true);
                                }}
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm font-medium"
                              >
                                Cambiar estado
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfiniteScroll>

          {/* Modal para cambiar estado */}
          {showStatusModal && selectedReport && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Cambiar estado del reporte
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Reporte: {selectedReport.title}
                  </p>
                  
                  <div className="space-y-3">
                    {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedReport.id, status)}
                        disabled={statusUpdateLoading}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          selectedReport.status === status
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{getStatusDisplayName(status)}</span>
                          {selectedReport.status === status && (
                            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedReport(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorityPanelPageInfinite; 
