import React, { useState } from 'react';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import './ReportCard.css';

const ReportCard = ({
  report,
  authorities,
  onSelect,
  onAssign,
  onStatusChange,
  assigningReport,
  isCritical,
  getStatusColor,
  getPriorityColor,
  formatDate
}) => {
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  const handleAssign = (authorityId) => {
    onAssign(report.id, authorityId);
    setShowAssignDropdown(false);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(report.id, newStatus);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sin_atender':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'en_proceso':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'resuelto':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rechazado':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgente':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'alta':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'media':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'baja':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`report-card ${isCritical ? 'critical' : ''}`}>
      <div className="report-header">
        <div className="report-id">
          <Typography variant="h3" className="report-number">
            #{report.id}
          </Typography>
          {isCritical && (
            <div className="critical-badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>CrÃ­tico</span>
            </div>
          )}
        </div>
        
        <div className="report-status">
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(report.status) }}
          >
            {getStatusIcon(report.status)}
            <span>{report.status.replace('_', ' ')}</span>
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
            <span className="meta-label">Prioridad:</span>
            <div 
              className="priority-badge"
              style={{ color: getPriorityColor(report.priority) }}
            >
              {getPriorityIcon(report.priority)}
              <span>{report.priority}</span>
            </div>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Fecha:</span>
            <span className="meta-value">{formatDate(report.createdAt)}</span>
          </div>
        </div>

        <div className="report-assignment">
          <div className="assignment-info">
            <span className="assignment-label">Asignado a:</span>
            {report.assignedTo ? (
              <div className="assigned-user">
                <div className="user-avatar">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="user-name">{report.assignedTo.name}</span>
              </div>
            ) : (
              <span className="unassigned">Sin asignar</span>
            )}
          </div>

          <div className="assignment-actions">
            <div className="dropdown-container">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                disabled={assigningReport === report.id}
                loading={assigningReport === report.id}
                className="assign-button"
              >
                {report.assignedTo ? 'Reasignar' : 'Asignar'}
              </Button>
              
              {showAssignDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <Typography variant="caption">Seleccionar responsable</Typography>
                  </div>
                  <div className="dropdown-options">
                    <button
                      className="dropdown-option"
                      onClick={() => handleAssign(null)}
                    >
                      <div className="option-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span>Sin asignar</span>
                    </button>
                    {authorities.map(authority => (
                      <button
                        key={authority.id}
                        className="dropdown-option"
                        onClick={() => handleAssign(authority.id)}
                      >
                        <div className="option-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span>{authority.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="status-dropdown">
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
        </div>
      </div>

      <div className="report-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={onSelect}
          className="view-details-button"
        >
          Ver detalles
        </Button>
      </div>
    </Card>
  );
};

export default ReportCard; 
