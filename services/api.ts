import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hydora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo limpiar localStorage
      // No redirigir automáticamente, dejar que el AuthContext maneje esto
      localStorage.removeItem('hydora_token');
      localStorage.removeItem('hydora_user');
      
      // Solo redirigir si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        // Usar un timeout para evitar problemas de navegación
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// Tipos
interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  latitude: number;
  longitude: number;
  address: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  user?: User;
  assignedTo?: User;
}

interface ReportFilters {
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  updatedAfter?: number;
}

interface ReportsResponse {
  success: boolean;
  data?: Report[];
  reports?: Report[];
  total?: number;
  message?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationsResponse {
  success: boolean;
  data?: {
    notifications: Notification[];
    unreadCount: number;
  };
  message?: string;
}

// Servicios de autenticación
export const authService = {
  // Login
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    try {
  console.log('API Service - Credentials recibidas:', credentials);
  console.log('API Service - Email:', credentials.email);
  console.log('API Service - Password:', credentials.password ? '***' : 'VACÍO');
      
      const response = await api.post('/users/login', credentials);
      
  console.log('API Service - Respuesta del backend:', response.data);
  console.log('API Service - response.data.success:', response.data.success);
  console.log('API Service - response.data.data:', response.data.data);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
  console.log('API Service - Token extraído:', token ? '***' : 'NO TOKEN');
  console.log('API Service - User extraído:', user);
        
        return { 
          success: true, 
          user: user,
          token: token
        };
      } else {
  console.log('API Service - Login falló:', response.data.message);
        return { 
          success: false, 
          message: response.data.message 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Registro
  register: async (userData: any): Promise<AuthResponse> => {
    try {
      const response = await api.post('/users/register', userData);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        return { 
          success: true, 
          user: user,
          token: token
        };
      } else {
        return { 
          success: false, 
          message: response.data.message 
        };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, user: response.data.data };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Renovar token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/refresh');
      return { success: true, token: response.data.token };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Obtener estadísticas del usuario
  getUserStats: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get('/users/stats');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Get user stats error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },
};

// Servicios de reportes
export const reportService = {
  // Obtener reportes con filtros
  getReports: async (filters: ReportFilters = {}): Promise<ReportsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'dateRange' && typeof value === 'object') {
            if (value.start) queryParams.append('startDate', value.start);
            if (value.end) queryParams.append('endDate', value.end);
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get(`/reports?${queryParams.toString()}`);
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error('Get reports error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Obtener todos los reportes (sin filtros)
  getAll: async (): Promise<ReportsResponse> => {
    try {
      const response = await api.get('/reports');
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error('Get all reports error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Obtener reportes del usuario autenticado
  getUserReports: async (filters: ReportFilters = {}): Promise<ReportsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'dateRange' && typeof value === 'object') {
            if (value.start) queryParams.append('dateFrom', value.start);
            if (value.end) queryParams.append('dateTo', value.end);
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get(`/reports/my-reports?${queryParams.toString()}`);
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error('Get user reports error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Obtener reporte por ID
  getById: async (id: string): Promise<{ success: boolean; data?: Report; message?: string }> => {
    try {
      const response = await api.get(`/reports/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get report by ID error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Crear reporte
  create: async (reportData: any): Promise<{ success: boolean; data?: Report; message?: string }> => {
    try {
      const response = await api.post('/reports', reportData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Create report error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Actualizar reporte
  update: async (id: string, updateData: any): Promise<{ success: boolean; data?: Report; message?: string }> => {
    try {
      const response = await api.put(`/reports/${id}`, updateData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update report error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Asignar reporte
  assign: async (id: string, userId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.patch(`/reports/${id}/assign`, { userId });
      return { success: true };
    } catch (error: any) {
      console.error('Assign report error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Eliminar reporte
  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.delete(`/reports/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error('Delete report error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },
};

// Servicios de notificaciones
export const notificationService = {
  // Obtener notificaciones
  getNotifications: async (): Promise<NotificationsResponse> => {
    try {
      const response = await api.get('/notifications');
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error('Get notifications error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Marcar como leída
  markAsRead: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.patch(`/notifications/${id}/read`);
      return { success: true };
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Marcar todas como leídas
  markAllAsRead: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.patch('/notifications/read-all');
      return { success: true };
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Suscribirse a push notifications
  subscribeToPush: async (token: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.post('/notifications/subscribe', { token });
      return { success: true };
    } catch (error: any) {
      console.error('Subscribe to push error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Enviar notificación
  sendNotification: async (userId: string, title: string, body: string, type: string = 'info', data: any = {}): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.post('/notifications/send', { userId, title, body, type, data });
      return { success: true };
    } catch (error: any) {
      console.error('Send notification error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },
};

// Servicios de comentarios
export const commentService = {
  // Obtener comentarios de un reporte
  getComments: async (reportId: string): Promise<{ success: boolean; data?: any[]; message?: string }> => {
    try {
      const response = await api.get(`/reports/${reportId}/comments`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get comments error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Agregar comentario
  addComment: async (reportId: string, commentData: any): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post(`/reports/${reportId}/comments`, commentData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Add comment error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Agregar respuesta
  addReply: async (reportId: string, parentId: string, replyData: any): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post(`/reports/${reportId}/comments/${parentId}/replies`, replyData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Add reply error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },
}; 

// Servicios de usuarios (solo para administradores)
export const userService = {
  // Obtener lista de usuarios
  getUsers: async (filters: any = {}): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const response = await api.get(`/users/list?${queryParams.toString()}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Get users error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Crear usuario
  createUser: async (userData: any): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/users/create', userData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Create user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Actualizar usuario
  updateUser: async (userId: string, userData: any): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Eliminar usuario
  deleteUser: async (userId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.delete(`/users/${userId}`);
      return { success: true };
    } catch (error: any) {
      console.error('Delete user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Activar usuario
  activateUser: async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post(`/users/activate/${email}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Activate user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  }
}; 