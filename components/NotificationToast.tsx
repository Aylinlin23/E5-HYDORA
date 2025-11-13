import React, { useEffect } from 'react';
import { CheckIcon, WarningIcon, DocumentIcon } from '../ui/Icons';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          borderColor: '#059669',
          icon: <CheckIcon />
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          icon: <WarningIcon />
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          borderColor: '#D97706',
          icon: <WarningIcon />
        };
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          icon: <DocumentIcon />
        };
      default:
        return {
          backgroundColor: '#6B7280',
          borderColor: '#4B5563',
          icon: <DocumentIcon />
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        minWidth: '300px',
        maxWidth: '400px',
        padding: '16px 20px',
        backgroundColor: styles.backgroundColor,
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${styles.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideIn 0.3s ease-out',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
  <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>{styles.icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          {message}
                </p>
              </div>
                <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          opacity: 0.8,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        ×
                </button>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
        </div>
  );
};

export default NotificationToast; 
