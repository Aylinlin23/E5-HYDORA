import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api.ts';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  emailVerified?: boolean;
  jurisdiction?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  register: (userData: any) => Promise<RegisterResponse>;
  refreshUser: () => Promise<LoginResponse>;
  isAuthenticated: boolean;
  userRole: string | null;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Inicializar usuario desde localStorage inmediatamente
    const storedUser = localStorage.getItem('hydora_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    // Inicializar token desde localStorage inmediatamente
    return localStorage.getItem('hydora_token');
  });
  const [loading, setLoading] = useState(true);

  // Función de login
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
  console.log('AuthContext - Email recibido:', email);
  console.log('AuthContext - Password recibido:', password ? '***' : 'VACÍO');
      
      const response = await authService.login({ email, password });
      
  console.log('AuthContext - Respuesta completa del login:', response);
  console.log('AuthContext - response.success:', response.success);
  console.log('AuthContext - response.token:', response.token ? '***' : 'NO TOKEN');
  console.log('AuthContext - response.user:', response.user);
      
      if (response.success && response.token && response.user) {
        const { token: newToken, user: userData } = response;
        
  console.log('AuthContext - Guardando en localStorage...');
        
        // Guardar en localStorage
        localStorage.setItem('hydora_token', newToken);
        localStorage.setItem('hydora_user', JSON.stringify(userData));
        
        // Actualizar estado
        setToken(newToken);
        setUser(userData);
        
  console.log('AuthContext - Estado actualizado, user:', userData);
        
        return { success: true, user: userData };
      } else {
  console.log('AuthContext - Login falló:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  // Función de logout
  const logout = (): void => {
    // Limpiar localStorage
    localStorage.removeItem('hydora_token');
    localStorage.removeItem('hydora_user');
    
    // Limpiar estado
    setToken(null);
    setUser(null);
  };

  // Función para refrescar datos del usuario
  const refreshUser = async (): Promise<LoginResponse> => {
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success && response.user) {
        const userData = response.user;
        
        // Actualizar localStorage y estado
        localStorage.setItem('hydora_user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        logout();
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Error al refrescar usuario:', error);
      logout();
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener datos del usuario' 
      };
    }
  };

  // Función de registro
  const register = async (userData: any): Promise<RegisterResponse> => {
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.token && response.user) {
        const { token: newToken, user: newUser } = response;
        
        // Guardar en localStorage
        localStorage.setItem('hydora_token', newToken);
        localStorage.setItem('hydora_user', JSON.stringify(newUser));
        
        // Actualizar estado
        setToken(newToken);
        setUser(newUser);
        
        return { success: true, user: newUser };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrar usuario' 
      };
    }
  };

  // Función para verificar si el token está próximo a expirar
  const checkTokenExpiration = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convertir a milisegundos
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Si el token expira en menos de 5 minutos, considerarlo próximo a expirar
      return timeUntilExpiration < 5 * 60 * 1000;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true; // Si hay error, considerar que expira
    }
  };

  // Función para renovar el token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      if (response.success && response.token) {
        localStorage.setItem('hydora_token', response.token);
        setToken(response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al renovar token:', error);
      return false;
    }
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('hydora_token');
      const storedUser = localStorage.getItem('hydora_user');

      if (storedToken && storedUser) {
        try {
          // Verificar si el token está próximo a expirar
          if (checkTokenExpiration(storedToken)) {
            console.log('Token próximo a expirar, intentando renovar...');
            const refreshed = await refreshToken();
            if (!refreshed) {
              console.log('No se pudo renovar el token, limpiando sesión');
              logout();
              setLoading(false);
              return;
            }
          }

          // Verificar que el token sigue siendo válido
          const response = await authService.getCurrentUser();
          
          if (response.success && response.user) {
            // Token válido, actualizar datos del usuario
            const userData = response.user;
            localStorage.setItem('hydora_user', JSON.stringify(userData));
            setUser(userData);
          } else {
            // Token inválido, limpiar sesión
            console.log('Token inválido, limpiando sesión');
            logout();
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          // En caso de error de red, mantener la sesión local
          // Solo limpiar si es un error de autenticación específico
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Verificar expiración del token periódicamente
  useEffect(() => {
    if (!token) return;

    const checkTokenInterval = setInterval(async () => {
      if (token && checkTokenExpiration(token)) {
        console.log('Token próximo a expirar, renovando...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.log('No se pudo renovar el token, cerrando sesión');
          logout();
        }
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkTokenInterval);
  }, [token]);

  // Valor del contexto
  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated: !!token && !!user,
    userRole: user?.role || null,
  };

  // Log para debug
  console.log('AuthContext - Estado actual:', {
    user: user ? 'Presente' : 'No presente',
    token: token ? 'Presente' : 'No presente',
    isAuthenticated: !!token && !!user,
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 