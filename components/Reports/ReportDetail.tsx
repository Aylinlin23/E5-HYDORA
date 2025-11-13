import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { reportService, userService } from '../../services/api';
import Button from '../../ui/Button';
import Typography from '../../ui/Typography';
import Card from '../../ui/Card';
import Timeline from '../ui/Timeline';

const ReportDetail = ({ report, onClose, onUpdate }) => {
  const [history, setHistory] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReportHistory();
    loadAuthorities();
  }, [report.id]);

  const loadReportHistory = async () => {
    try {
      setLoading(true);
      const response = await reportService.getReportHistory(report.id);
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error loading report history:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAssign = async (authorityId) => {
    try {
      const response = await reportService.assignReport(report.id, authorityId);
      if (response.success) {
        onUpdate(response.data);
        loadReportHistory(); // Recargar historial
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await reportService.updateReportStatus(report.id, newStatus);
      if (response.success) {
        onUpdate(response.data);
        loadReportHistory(); // Recargar historial
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await reportService.exportReportPDF(report.id);
      if (response.success) {
        // Crear blob y descargar
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-${report.id}-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHistoryIcon = (action) => {
    switch (action) {
      case 'created':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'assigned':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'status_changed':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'commented':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getHistoryColor = (action) => {
    switch (action) {
      case 'created':
        return 'var(--color-success)';
      case 'assigned':
        return 'var(--color-primary)';
      case 'status_changed':
        return 'var(--color-warning)';
      case 'commented':
        return 'var(--color-info)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-text">
              <Typography variant="h1" className="modal-title">
                Reporte #{report.id}
              </Typography>
              <Typography variant="body" color="secondary" className="modal-subtitle">
                Detalles completos e historial
              </Typography>
            </div>
            
            <div className="header-actions">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={exporting}
                loading={exporting}
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                {exporting ? 'Exportando...' : 'Exportar PDF'}
              </Button>
              
              <Button
                variant="ghost"
                onClick={onClose}
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-layout">
            {/* InformaciÃ³n principal */}
            <div className="detail-main">
              <Card className="report-info-card">
                <div className="report-header">
                  <div className="report-id-section">
                    <Typography variant="h2" className="report-number">
                      #{report.id}
                    </Typography>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    >
                      {report.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="report-priority">
                    <div 
                      className="priority-badge"
                      style={{ color: getPriorityColor(report.priority) }}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {report.priority}
                    </div>
                  </div>
                </div>

                <div className="report-content">
                  <Typography variant="body" className="report-description">
                    {report.description}
                  </Typography>
                  
                  <div className="report-location">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{report.location}</span>
                  </div>

                  <div className="report-meta">
                    <div className="meta-item">
                      <span className="meta-label">Creado:</span>
                      <span className="meta-value">{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Actualizado:</span>
                      <span className="meta-value">{formatDate(report.updatedAt)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Reportado por:</span>
                      <span className="meta-value">{report.reporter?.name || 'AnÃ³nimo'}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AsignaciÃ³n */}
              <Card className="assignment-card">
                <Typography variant="h3" className="card-title">
                  AsignaciÃ³n
                </Typography>
                
                <div className="assignment-content">
                  <div className="current-assignment">
                    <span className="assignment-label">Responsable actual:</span>
                    {report.assignedTo ? (
                      <div className="assigned-user">
                        <div className="user-avatar">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{report.assignedTo.name}</span>
                          <span className="user-role">{report.assignedTo.role}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="unassigned">Sin asignar</span>
                    )}
                  </div>

                  <div className="assignment-actions">
                    <select
                      value={report.assignedTo?.id || ''}
                      onChange={(e) => handleAssign(e.target.value || null)}
                      className="assignment-select"
                    >
                      <option value="">Sin asignar</option>
                      {authorities.map(authority => (
                        <option key={authority.id} value={authority.id}>
                          {authority.name} - {authority.role}
                        </option>
                      ))}
                    </select>

                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="status-select"
                      style={{ borderColor: getStatusColor(report.status) }}
                    >
                      <option value="sin_atender">Sin atender</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="resuelto">Resuelto</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Historial */}
            <div className="detail-sidebar">
              <Card className="history-card">
                <Typography variant="h3" className="card-title">
                  Historial de Cambios
                </Typography>
                
                {loading ? (
                  <div className="loading-history">
                    <div className="loading-spinner"></div>
                    <Typography variant="body" color="secondary">
                      Cargando historial...
                    </Typography>
                  </div>
                ) : (
                  <Timeline>
                    {history.map((item, index) => (
                      <Timeline.Item
                        key={index}
                        icon={getHistoryIcon(item.action)}
                        iconColor={getHistoryColor(item.action)}
                        title={item.title}
                        subtitle={formatDate(item.timestamp)}
                        content={item.description}
                      />
                    ))}
                  </Timeline>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReportDetail; 
