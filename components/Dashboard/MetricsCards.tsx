import React from 'react';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import './MetricsCards.css';

const MetricsCards = ({ metrics }) => {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="metrics-cards">
      <div className="metrics-grid">
        {/* Tiempo promedio de resoluciÃ³n */}
        <Card className="metric-card">
          <div className="metric-icon time-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {formatTime(metrics.avgResolutionTime)}
            </Typography>
            <Typography variant="body" className="metric-label">
              Tiempo Promedio de ResoluciÃ³n
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {metrics.avgResolutionTime < metrics.previousAvgTime ? 'â†“' : 'â†‘'} 
              {Math.abs(metrics.avgResolutionTime - metrics.previousAvgTime)}m vs mes anterior
            </Typography>
          </div>
        </Card>

        {/* Reportes crÃ­ticos */}
        <Card className="metric-card critical">
          <div className="metric-icon critical-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {metrics.criticalReports}
            </Typography>
            <Typography variant="body" className="metric-label">
              Reportes CrÃ­ticos
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {formatPercentage(metrics.criticalReports, metrics.totalReports)} del total
            </Typography>
          </div>
        </Card>

        {/* Reportes asignados vs resueltos */}
        <Card className="metric-card">
          <div className="metric-icon assignment-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {metrics.assignedReports}
            </Typography>
            <Typography variant="body" className="metric-label">
              Reportes Asignados
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {metrics.resolvedReports} resueltos ({formatPercentage(metrics.resolvedReports, metrics.assignedReports)})
            </Typography>
          </div>
        </Card>

        {/* Eficiencia general */}
        <Card className="metric-card">
          <div className="metric-icon efficiency-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {formatPercentage(metrics.resolvedReports, metrics.totalReports)}
            </Typography>
            <Typography variant="body" className="metric-label">
              Tasa de ResoluciÃ³n
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {metrics.totalReports} reportes totales
            </Typography>
          </div>
        </Card>

        {/* Reportes nuevos esta semana */}
        <Card className="metric-card">
          <div className="metric-icon new-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {metrics.newReportsThisWeek}
            </Typography>
            <Typography variant="body" className="metric-label">
              Nuevos Esta Semana
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {metrics.newReportsToday} hoy
            </Typography>
          </div>
        </Card>

        {/* Zonas activas */}
        <Card className="metric-card">
          <div className="metric-icon zones-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="metric-content">
            <Typography variant="h3" className="metric-value">
              {metrics.activeZones}
            </Typography>
            <Typography variant="body" className="metric-label">
              Zonas Activas
            </Typography>
            <Typography variant="caption" color="secondary" className="metric-trend">
              {metrics.criticalZones} con reportes crÃ­ticos
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MetricsCards; 
