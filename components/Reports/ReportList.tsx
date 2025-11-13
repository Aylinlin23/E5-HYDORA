import React, { useState, useEffect } from 'react';
import { userService, reportService } from '../../services/api';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import ReportCard from './ReportCard';

const ReportList = ({ 
  reports, 
  onReportSelect, 
  onReportUpdate, 
  loading, 
  hasMore, 
  onLoadMore 
}) => {
  const [authorities, setAuthorities] = useState([]);
  const [assigningReport, setAssigningReport] = useState(null);

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    try {
      const response = await userService.getAuthorities();
      if (response.success) {
        setAuthorities(response.data);
      }
    } catch (error) {
      console.error('Error loading authorities:', error);
    }
  };

  const handleAssignReport = async (reportId, authorityId) => {
    try {
      setAssigningReport(reportId);
      const response = await reportService.assignReport(reportId, authorityId);
      
      if (response.success) {
        // Actualizar el reporte en la lista
        const updatedReport = response.data;
        onReportUpdate(updatedReport);
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    } finally {
      setAssigningReport(null);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await reportService.updateReportStatus(reportId, newStatus);
      
      if (response.success) {
        const updatedReport = response.data;
        onReportUpdate(updatedReport);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sin_atender':
        return 'var(--color-error)';
      case 'en_proceso':
        return 'var(--color-warning)';
      case 'resuelto':
        return 'var(--color-success)';
      case 'rechazado':
        return 'var(--color-text-tertiary)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgente':
        return 'var(--color-error)';
      case 'alta':
        return 'var(--color-warning)';
      case 'media':
        return 'var(--color-info)';
      case 'baja':
        return 'var(--color-success)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCritical = (report) => {
    const createdAt = new Date(report.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff > 48 && report.status === 'sin_atender';
  };

  return (
    <div className="reports-list">
      {reports.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <Typography variant="h3" className="empty-title">
            No se encontraron reportes
          </Typography>
          <Typography variant="body" color="secondary" className="empty-description">
            Intenta ajustar los filtros o crear un nuevo reporte
          </Typography>
        </div>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              authorities={authorities}
              onSelect={() => onReportSelect(report)}
              onAssign={handleAssignReport}
              onStatusChange={handleStatusChange}
              assigningReport={assigningReport}
              isCritical={isCritical(report)}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="load-more-container">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            loading={loading}
            className="load-more-button"
          >
            {loading ? 'Cargando...' : 'Cargar mÃ¡s'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportList; 
