import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../../ui/Typography';
import Button from '../../ui/Button';

const TopCriticalTable = ({ data }) => {
  const navigate = useNavigate();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sin_atender':
        return 'var(--color-error)';
      case 'en_proceso':
        return 'var(--color-warning)';
      case 'resuelto':
        return 'var(--color-success)';
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

  const handleViewReport = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="top-critical-table">
      <div className="table-container">
        <table className="critical-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>UbicaciÃ³n</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Tiempo</th>
              <th>Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((report) => (
              <tr key={report.id} className={report.isCritical ? 'critical-row' : ''}>
                <td className="report-id">
                  <Typography variant="body" className="id-text">
                    #{report.id}
                  </Typography>
                </td>
                <td className="report-location">
                  <Typography variant="body" className="location-text">
                    {report.location}
                  </Typography>
                </td>
                <td className="report-status">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    {report.status.replace('_', ' ')}
                  </div>
                </td>
                <td className="report-priority">
                  <div 
                    className="priority-badge"
                    style={{ color: getPriorityColor(report.priority) }}
                  >
                    {report.priority}
                  </div>
                </td>
                <td className="report-time">
                  <Typography variant="body" className="time-text">
                    {formatTime(report.timeSinceCreation)}
                  </Typography>
                </td>
                <td className="report-assigned">
                  {report.assignedTo ? (
                    <div className="assigned-user">
                      <div className="user-avatar">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <Typography variant="body" className="user-name">
                        {report.assignedTo.name}
                      </Typography>
                    </div>
                  ) : (
                    <Typography variant="body" color="secondary" className="unassigned">
                      Sin asignar
                    </Typography>
                  )}
                </td>
                <td className="report-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report.id)}
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="empty-table">
          <Typography variant="body" color="secondary">
            No hay reportes crÃ­ticos en este momento
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TopCriticalTable; 
