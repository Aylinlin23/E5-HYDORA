import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { reportService } from '../services/api';
import { useReportsCache } from '../hooks/useCache';
import MainNavigation from '../components/MainNavigation';
import AdvancedFilters from '../components/AdvancedFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner, { ListSpinner } from '../components/LoadingSpinner';
import PDFExport from '../components/PDFExport';
import ExportReports from '../components/ExportReports';

const AuthorityPanelPage: React.FC = () => {
  const { user } = useAuth();
  const { getCachedReports, setCachedReports } = useReportsCache();
  
  // Estado de reportes y paginaciÃ³n
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Estado de filtros
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    lat: '',
    lng: '',
    radius: ''
  });
  
  // Estado de paginaciÃ³n
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Estado de URL para persistencia
  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    // Cargar filtros desde URL al montar
    loadFiltersFromURL();
  }, []);

  useEffect(() => {
    // Actualizar URL cuando cambien los filtros
    updateURLFromFilters();
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    fetchReports();
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  const loadFiltersFromURL: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = {
      status: params.get('status') || 'all',
      priority: params.get('priority') || 'all',
      dateFrom: params.get('dateFrom') || '',
      dateTo: params.get('dateTo') || '',
      search: params.get('search') || '',
      lat: params.get('lat') || '',
      lng: params.get('lng') || '',
      radius: params.get('radius') || ''
    };
    
    const newPagination = {
      currentPage: parseInt(params.get('page')) || 1,
      itemsPerPage: parseInt(params.get('limit')) || 10,
      totalPages: 1,
      totalItems: 0
    };

    setFilters(newFilters);
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  const updateURLFromFilters: React.FC = () => {
    const params = new URLSearchParams();
    
    // Agregar filtros a URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    
    // Agregar paginaciÃ³n a URL
    params.set('page', pagination.currentPage.toString());
    params.set('limit', pagination.itemsPerPage.toString());
    
    // Actualizar URL sin recargar la pÃ¡gina
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
    setUrlParams(params);
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Crear clave de cache basada en filtros y paginaciÃ³n
      const cacheKey = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };
      
      // Intentar obtener del cache primero
      const cachedReports = getCachedReports(cacheKey);
      if (cachedReports) {
        setReports(cachedReports.reports);
        setPagination(cachedReports.pagination);
        setLoading(false);
        return;
      }

      const response = await reportService.getAll(
        filters, 
        pagination.currentPage, 
        pagination.itemsPerPage
      );
      
      if (response.success) {
        const reportsData = response.reports || [];
        const paginationData = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10
        };
        
        setReports(reportsData);
        setPagination(paginationData);
        
        // Guardar en cache
        setCachedReports({
          reports: reportsData,
          pagination: paginationData
        }, cacheKey);
      } else {
        console.error('Error fetching reports:', response.message);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset a primera pÃ¡gina
  };

  const handlePageChange = (newPage, newItemsPerPage = pagination.itemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
      itemsPerPage: newItemsPerPage
    }));
  };

  const handleResetFilters = (resetFilters) => {
    setFilters(resetFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await reportService.updateStatus(reportId, {
        status: newStatus,
        reason: 'Cambio realizado por autoridad',
        changedBy: user.name,
      });

      if (response.success) {
        alert('Estado actualizado exitosamente');
        fetchReports(); // Recargar datos
        setSelectedReport(null);
      } else {
        alert(response.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error de conexiÃ³n. Verifica tu conexiÃ³n a internet.');
    }
  };

  const handleExport = (type) => {
    console.log(`${type.toUpperCase()} exportado exitosamente`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MainNavigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ListSpinner count={5} />
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panel de Autoridad
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gestiona todos los reportes de fugas de agua en tu jurisdicciÃ³n
            </p>
          </div>

          {/* Filtros avanzados */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            showGeographic={true}
            showSearch={true}
          />

          {/* ExportaciÃ³n de reportes */}
          <div className="mt-6">
            <ExportReports
              reports={reports}
              filters={filters}
              onExport={handleExport}
            />
          </div>

          {/* EstadÃ­sticas rÃ¡pidas */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {pagination.totalItems}
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
            </div>
          </div>

          {/* Lista de reportes */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
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
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {report.user?.name}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {report.address || 'Sin direcciÃ³n'}
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
                              onClick={() => setSelectedReport(report)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                            >
                              Ver detalle y gestionar
                            </button>
                            <PDFExport 
                              report={report} 
                              onExport={handleExport}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* PaginaciÃ³n */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}

          {/* Modal de detalle */}
          {selectedReport && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Gestionar Reporte
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">TÃ­tulo</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedReport.title}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DescripciÃ³n</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedReport.description}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado Actual</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedReport.status)}`}>
                        {getStatusDisplayName(selectedReport.status)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cambiar Estado</label>
                      <select
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== selectedReport.status) {
                            handleStatusChange(selectedReport.id, newStatus);
                          }
                        }}
                      >
                        <option value={selectedReport.status}>
                          {getStatusDisplayName(selectedReport.status)}
                        </option>
                        {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(status => (
                          status !== selectedReport.status && (
                            <option key={status} value={status}>
                              {getStatusDisplayName(status)}
                            </option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cerrar
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

export default AuthorityPanelPage; 
