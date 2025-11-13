import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/api.ts';

// Tipos
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  data?: any;
}

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isSubscribed: boolean;
  toasts: Toast[];
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
  removeToast: (id: string) => void;
  sendNotification: (userId: string, title: string, body: string, type?: 'info' | 'success' | 'warning' | 'error', data?: any) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Inicializar notificaciones push
  useEffect(() => {
    if (user) {
      initializePushNotifications();
      loadNotifications();
    }
  }, [user]);

  // Cargar notificaciones del servidor
  const loadNotifications = async (): Promise<void> => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Inicializar notificaciones push
  const initializePushNotifications = async (): Promise<void> => {
    try {
      // Verificar si el navegador soporta notificaciones
      if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones');
        return;
      }

      // Solicitar permisos
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Permisos de notificación denegados');
          return;
        }
      }

      // Registrar service worker para FCM (si está disponible)
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registrado:', registration);
          
          // Obtener token de FCM
          const token = await getFCMToken();
          if (token) {
            await notificationService.subscribeToPush(token);
            setIsSubscribed(true);
          }
        } catch (error) {
          console.log('Service Worker no disponible, usando Notification API');
        }
      }

      // Configurar listener para notificaciones
      setupNotificationListener();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  // Obtener token de FCM
  const getFCMToken = async (): Promise<string | null> => {
    try {
      // Aquí se integraría con Firebase Cloud Messaging
      // Por ahora retornamos null para usar Notification API
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  // Configurar listener de notificaciones
  const setupNotificationListener = (): void => {
    // Listener para notificaciones push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION') {
          showNotification(event.data.notification);
        }
      });
    }
  };

  // Mostrar notificación del sistema
  const showNotification = (notification: Notification): void => {
    if (Notification.permission === 'granted') {
      const systemNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        data: notification.data
      });

      systemNotification.onclick = () => {
        handleNotificationClick(notification);
        systemNotification.close();
      };
    }
  };

  // Manejar clic en notificación
  const handleNotificationClick = (notification: Notification): void => {
    markAsRead(notification.id);
    
    // Navegar a la página correspondiente
    if (notification.data && notification.data.url) {
      window.location.href = notification.data.url;
    }
  };

  // Mostrar toast
  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 5000): void => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      title,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remover toast después del tiempo especificado
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  // Remover toast
  const removeToast = (id: string): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async (): Promise<void> => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Enviar notificación
  const sendNotification = async (userId: string, title: string, body: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', data: any = {}): Promise<void> => {
    try {
      await notificationService.sendNotification(userId, title, body, type, data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isSubscribed,
    toasts,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    showToast,
    removeToast,
    sendNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 