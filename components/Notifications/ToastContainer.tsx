import React from 'react';
import { useNotifications } from '../../store/NotificationContext';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { createPortal } from 'react-dom';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1zM14 5h6V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1z" />
          </svg>
        );
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-error)';
      case 'warning':
        return 'var(--color-warning)';
      case 'info':
        return 'var(--color-info)';
      default:
        return 'var(--color-primary)';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    return time.toLocaleTimeString();
  };

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          style={{ '--toast-color': getToastColor(toast.type) }}
        >
          <div className="toast-icon">
            {getToastIcon(toast.type)}
          </div>
          
          <div className="toast-content">
            <Typography variant="body" className="toast-title">
              {toast.title}
            </Typography>
            {toast.message && (
              <Typography variant="caption" color="secondary" className="toast-message">
                {toast.message}
              </Typography>
            )}
            <Typography variant="caption" color="tertiary" className="toast-time">
              {formatTime(toast.timestamp)}
            </Typography>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeToast(toast.id)}
            className="toast-close"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>

          <div className="toast-progress"></div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer; 
