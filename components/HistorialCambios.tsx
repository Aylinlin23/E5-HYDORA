import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import PDFExport from './PDFExport';

const HistorialCambios = ({ historial = [], reporteId, reporteTitulo }) => {
  const { user } = useAuth();
  const [showFullHistory, setShowFullHistory] = useState(false);

  // Parsear el historial si viene como string JSON
  const parseHistorial = (historial) => {
    if (typeof historial === 'string') {
      try {
        return JSON.parse(historial);
      } catch (error) {
        console.error('Error parsing historial:', error);
        return [];
      }
    }
    return historial || [];
  };

  const historialData = parseHistorial(historial);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'RESOLVED':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'REJECTED':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} dÃ­a${days > 1 ? 's' : ''}`;
    }
  };

  const handleDownloadPDF: React.FC = () => {
    const historialData = parseHistorial(historial);
    const pdfData = {
      title: `Historial de Cambios - ${reporteTitulo}`,
      subtitle: `Reporte ID: ${reporteId}`,
      data: historialData.map(item => ({
        fecha: formatDate(item.fecha),
        usuario: item.usuario || 'Sistema',
        estadoPrevio: getStatusDisplayName(item.estadoPrevio),
        estadoNuevo: getStatusDisplayName(item.estadoNuevo),
        comentario: item.comentario || ''
      }))
    };
    
    PDFExport.exportHistorial(pdfData);
  };

  if (historialData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Historial de Cambios
          </h3>
          {user.role === 'AUTHORITY' && historialData.length > 0 && (
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </button>
          )}
        </div>
        
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No hay historial disponible
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Este reporte aÃºn no ha tenido cambios de estado.
          </p>
        </div>
      </div>
    );
  }

  // Mostrar solo los Ãºltimos 3 cambios si no se muestra el historial completo
  const displayedHistorial = showFullHistory ? historialData : historialData.slice(-3);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Historial de Cambios
        </h3>
        <div className="flex space-x-2">
          {historialData.length > 3 && (
            <button
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showFullHistory ? 'Ver menos' : `Ver todos (${historialData.length})`}
            </button>
          )}
          {user.role === 'AUTHORITY' && (
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
          )}
        </div>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {displayedHistorial.map((item, index) => (
            <li key={index}>
              <div className="relative pb-8">
                {index !== displayedHistorial.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                      {getStatusIcon(item.estadoNuevo)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.estadoNuevo)}`}>
                          {getStatusDisplayName(item.estadoNuevo)}
                        </span>
                        {item.estadoPrevio && item.estadoPrevio !== item.estadoNuevo && (
                          <>
                            <span className="text-gray-400 dark:text-gray-500">â†’</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.estadoPrevio)}`}>
                              {getStatusDisplayName(item.estadoPrevio)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Cambiado por <span className="font-medium text-gray-900 dark:text-white">{item.usuario || 'Sistema'}</span>
                      </p>
                      {item.comentario && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                          "{item.comentario}"
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <time dateTime={item.fecha} title={formatDate(item.fecha)}>
                        {getTimeAgo(item.fecha)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!showFullHistory && historialData.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowFullHistory(true)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
          >
            Ver historial completo ({historialData.length} cambios)
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorialCambios; 
