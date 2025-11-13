import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/api';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  inProgressReports: number;
  rejectedReports: number;
  averageResponseTime: number;
  lastActivity: string;
}

interface StatsContextType {
  stats: UserStats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    inProgressReports: 0,
    rejectedReports: 0,
    averageResponseTime: 0,
    lastActivity: ''
  });
  const [loading, setLoading] = useState(false);

  const refreshStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await authService.getUserStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, [user]);

  // Actualizar estadísticas cuando se regresa a la aplicación
  useEffect(() => {
    const handleFocus = () => {
      refreshStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const value = {
    stats,
    loading,
    refreshStats
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
}; 