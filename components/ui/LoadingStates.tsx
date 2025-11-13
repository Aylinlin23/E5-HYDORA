import React from 'react';
import Typography from './Typography';

// Skeleton para tarjetas de reporte
export const ReportCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
    </div>
    <div className="skeleton-body">
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
    <div className="skeleton-footer">
      <div className="skeleton-badge"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Skeleton para listas
export const ListSkeleton = ({ count = 3 }) => (
  <div className="skeleton-list">
    {Array.from({ length: count }).map((_, index) => (
      <ReportCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton para tablas
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="skeleton-header-cell"></div>
      ))}
    </div>
    <div className="skeleton-table-body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para mapas
export const MapSkeleton = () => (
  <div className="skeleton-map">
    <div className="skeleton-map-container">
      <div className="skeleton-map-overlay">
        <div className="skeleton-map-controls">
          <div className="skeleton-control"></div>
          <div className="skeleton-control"></div>
          <div className="skeleton-control"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton para grÃ¡ficos
export const ChartSkeleton = () => (
  <div className="skeleton-chart">
    <div className="skeleton-chart-header">
      <div className="skeleton-chart-title"></div>
      <div className="skeleton-chart-legend">
        <div className="skeleton-legend-item"></div>
        <div className="skeleton-legend-item"></div>
        <div className="skeleton-legend-item"></div>
      </div>
    </div>
    <div className="skeleton-chart-content">
      <div className="skeleton-chart-bars">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="skeleton-chart-bar"></div>
        ))}
      </div>
    </div>
  </div>
);

// Loading spinner general
export const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => (
  <div className={`loading-container loading-${size}`}>
    <div className="loading-spinner"></div>
    {text && (
      <Typography variant="body" color="secondary" className="loading-text">
        {text}
      </Typography>
    )}
  </div>
);

// Estado vacÃ­o
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action = null,
  className = '' 
}) => (
  <div className={`empty-state ${className}`}>
    {icon && (
      <div className="empty-state-icon">
        {icon}
      </div>
    )}
    <Typography variant="h3" className="empty-state-title">
      {title}
    </Typography>
    <Typography variant="body" color="secondary" className="empty-state-description">
      {description}
    </Typography>
    {action && (
      <div className="empty-state-action">
        {action}
      </div>
    )}
  </div>
);

// Estado de error con retry
export const ErrorState = ({ 
  title = 'Algo saliÃ³ mal', 
  description = 'No se pudo cargar el contenido',
  onRetry = null,
  error = null
}) => (
  <div className="error-state">
    <div className="error-state-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <Typography variant="h3" className="error-state-title">
      {title}
    </Typography>
    <Typography variant="body" color="secondary" className="error-state-description">
      {description}
    </Typography>
    {error && (
      <details className="error-details">
        <summary>Ver detalles del error</summary>
        <pre className="error-stack">{error.message || error}</pre>
      </details>
    )}
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Intentar de nuevo
      </button>
    )}
  </div>
); 
