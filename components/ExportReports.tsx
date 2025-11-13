import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import PDFExport from './PDFExport';
import Papa from 'papaparse';

const ExportReports = ({ reports = [], filters = {}, onExport }) => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('pdf');

  // Verificar permisos
  if (!['AUTHORITY', 'ADMIN'].includes(user.role)) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const prepareDataForExport: React.FC = () => {
    return reports.map(report => ({
      ID: report.id,
      Titulo: report.title,
      Descripcion: report.description,
      Estado: getStatusDisplayName(report.status),
      Prioridad: getPriorityDisplayName(report.priority),
      Ubicacion: report.address || 'No especificada',
      Coordenadas: `${report.latitude}, ${report.longitude}`,
      Reportado_por: report.user?.name || 'Usuario',
      Email: report.user?.email || 'Sin email',
      Fecha_creacion: formatDate(report.createdAt),
      Ultima_actualizacion: formatDate(report.updatedAt),
      Fotos: report.photos ? report.photos.split(',').length : 0
    }));
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      
      const exportData = {
        title: 'Reporte de Incidencias - Hydora',
        subtitle: `Generado el ${formatDate(new Date())}`,
        filters: Object.keys(filters).length > 0 ? `Filtros aplicados: ${JSON.stringify(filters)}` : 'Sin filtros',
        data: prepareDataForExport()
      };

      PDFExport.exportReportsList(exportData);
      
      if (onExport) {
        onExport('pdf');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      
      const data = prepareDataForExport();
      const csv = Papa.unparse(data);
      
      // Crear y descargar archivo CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reportes_hydora_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      if (onExport) {
        onExport('csv');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleExport: React.FC = () => {
    if (exportType === 'pdf') {
      handleExportPDF();
    } else {
      handleExportCSV();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Exportar Reportes
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {reports.length} reporte{reports.length !== 1 ? 's' : ''} seleccionado{reports.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {/* Selector de tipo de exportaciÃ³n */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formato de exportaciÃ³n
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="pdf"
                checked={exportType === 'pdf'}
                onChange={(e) => setExportType(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">PDF</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="csv"
                checked={exportType === 'csv'}
                onChange={(e) => setExportType(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">CSV</span>
            </label>
          </div>
        </div>

        {/* InformaciÃ³n del reporte */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            InformaciÃ³n del reporte
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total reportes:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{reports.length}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatDate(new Date())}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Generado por:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.name}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Rol:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {user.role === 'AUTHORITY' ? 'Autoridad' : 'Administrador'}
              </span>
            </div>
          </div>
        </div>

        {/* Campos incluidos */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Campos incluidos en la exportaciÃ³n
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>â€¢ ID del reporte</span>
            <span>â€¢ TÃ­tulo y descripciÃ³n</span>
            <span>â€¢ Estado y prioridad</span>
            <span>â€¢ UbicaciÃ³n y coordenadas</span>
            <span>â€¢ Usuario que reportÃ³</span>
            <span>â€¢ Fechas de creaciÃ³n y actualizaciÃ³n</span>
            <span>â€¢ NÃºmero de fotos</span>
            <span>â€¢ Email del usuario</span>
          </div>
        </div>

        {/* BotÃ³n de exportaciÃ³n */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={exporting || reports.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar {exportType.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReports; 
