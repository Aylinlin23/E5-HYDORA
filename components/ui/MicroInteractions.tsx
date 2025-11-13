import React, { useState, useEffect } from 'react';

// Hover en tarjetas con elevaciÃ³n
export const HoverCard = ({ children, className = '', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`hover-card ${isHovered ? 'hovered' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

// Pulso para reportes crÃ­ticos
export const CriticalPulse = ({ children, isCritical = false, className = '' }) => {
  return (
    <div className={`critical-pulse ${isCritical ? 'pulsing' : ''} ${className}`}>
      {children}
    </div>
  );
};

// TransiciÃ³n de estado con animaciÃ³n
export const StatusTransition = ({ 
  children, 
  status, 
  previousStatus, 
  className = '' 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (status !== previousStatus) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [status, previousStatus]);

  return (
    <div className={`status-transition ${isTransitioning ? 'transitioning' : ''} ${className}`}>
      {children}
    </div>
  );
};

// BotÃ³n con feedback tÃ¡ctil
export const TactileButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`tactile-button ${isPressed ? 'pressed' : ''} ${className}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Indicador de progreso animado
export const ProgressIndicator = ({ 
  progress = 0, 
  total = 100, 
  className = '' 
}) => {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <div className={`progress-indicator ${className}`}>
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="progress-text">
        {progress} de {total}
      </span>
    </div>
  );
};

// NotificaciÃ³n toast con animaciÃ³n
export const AnimatedToast = ({ 
  children, 
  type = 'info', 
  duration = 5000,
  onClose,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`animated-toast ${type} ${isExiting ? 'exiting' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Loading con dots animados
export const LoadingDots = ({ text = 'Cargando' }) => {
  return (
    <div className="loading-dots">
      <span>{text}</span>
      <span className="dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </div>
  );
};

// Skeleton con shimmer
export const ShimmerSkeleton = ({ className = '', children }) => {
  return (
    <div className={`shimmer-skeleton ${className}`}>
      {children}
    </div>
  );
};

// Badge con contador animado
export const AnimatedBadge = ({ count = 0, maxCount = 99, className = '' }) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className={`animated-badge ${count > 0 ? 'has-count' : ''} ${className}`}>
      <span className="badge-count">{displayCount}</span>
    </div>
  );
};

// Tooltip con animaciÃ³n
export const AnimatedTooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`animated-tooltip ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip-content ${position}`}>
          {content}
        </div>
      )}
    </div>
  );
}; 
