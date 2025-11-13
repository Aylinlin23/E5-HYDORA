import React from 'react';
import Typography from '../../ui/Typography';
import Button from '../../ui/Button';

const CriticalAlert = ({ report, onViewReport }) => {
  const isCritical = report.status === 'sin_atender' && report.timeSinceCreation > 48 * 60; // 48 horas en minutos

  if (!isCritical) return null;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} dÃ­a${days > 1 ? 's' : ''}`;
    }
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  };

  const getCriticalLevel = (minutes) => {
    if (minutes > 72 * 60) return 'urgent'; // MÃ¡s de 3 dÃ­as
    if (minutes > 48 * 60) return 'critical'; // MÃ¡s de 2 dÃ­as
    return 'warning'; // MÃ¡s de 1 dÃ­a
  };

  const criticalLevel = getCriticalLevel(report.timeSinceCreation);

  return (
    <div className={`critical-alert ${criticalLevel}`}>
      <div className="alert-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <div className="alert-content">
        <Typography variant="h4" className="alert-title">
          Reporte CrÃ­tico
        </Typography>
        <Typography variant="body" className="alert-message">
          Este reporte lleva sin atender {formatTime(report.timeSinceCreation)}
        </Typography>
        <Typography variant="caption" color="secondary" className="alert-details">
          ID: #{report.id} â€¢ {report.location}
        </Typography>
      </div>

      <div className="alert-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewReport(report.id)}
        >
          Ver Reporte
        </Button>
      </div>

      <div className="alert-pulse"></div>
    </div>
  );
};

export default CriticalAlert; 
