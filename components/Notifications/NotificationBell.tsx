import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../store/NotificationContext';
import Typography from '../../ui/Typography';
import Button from '../../ui/Button';
import { createPortal } from 'react-dom';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    // Navegar a la pÃ¡gina correspondiente
    if (notification.data && notification.data.url) {
      window.location.href = notification.data.url;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'comment':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'assignment':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'status':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  const getNotificationColor = (type) => {
    switch (type) {
      case 'report':
        return '#2563eb'; // Azul - confianza
      case 'comment':
        return '#10b981'; // Verde - bienestar
      case 'assignment':
        return '#f59e0b'; // Amarillo - atención
      case 'status':
        return '#10b981'; // Verde - progreso
      default:
        return '#6b7280'; // Gris neutral
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="bell-button"
        icon={
          <div className="bell-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1zM14 5h6V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1z" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        }
      />

      {isOpen && createPortal(
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <Typography variant="h4" className="dropdown-title">
              Notificaciones
            </Typography>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="mark-all-read"
              >
                Marcar todas como leÃ­das
              </Button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1zM14 5h6V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1z" />
                </svg>
                <Typography variant="body" color="secondary">
                  No hay notificaciones
                </Typography>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div 
                    className="notification-icon"
                    style={{ color: getNotificationColor(notification.type) }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <Typography variant="body" className="notification-title">
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="secondary" className="notification-message">
                      {notification.body}
                    </Typography>
                    <Typography variant="caption" color="tertiary" className="notification-time">
                      {formatTime(notification.createdAt)}
                    </Typography>
                  </div>

                  {!notification.read && (
                    <div className="unread-indicator" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="dropdown-footer">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  // Navegar a pÃ¡gina de todas las notificaciones
                  window.location.href = '/notifications';
                }}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotificationBell; 
