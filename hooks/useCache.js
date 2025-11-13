import { useState, useEffect, useCallback } from 'react';

const CACHE_PREFIX = 'hydora_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

export const useCache = (key, ttl = DEFAULT_TTL) => {
  const [cache, setCache] = useState(new Map());
  const [timestamps, setTimestamps] = useState(new Map());

  // Obtener datos del cache
  const getCachedData = useCallback((cacheKey) => {
    const fullKey = `${CACHE_PREFIX}${cacheKey}`;
    const cached = localStorage.getItem(fullKey);
    const timestamp = timestamps.get(cacheKey);
    
    if (cached && timestamp) {
      const now = Date.now();
      if (now - timestamp < ttl) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Error parsing cached data:', e);
          return null;
        }
      } else {
        // Cache expirado
        localStorage.removeItem(fullKey);
        timestamps.delete(cacheKey);
        return null;
      }
    }
    
    return null;
  }, [timestamps, ttl]);

  // Guardar datos en cache
  const setCachedData = useCallback((cacheKey, data) => {
    const fullKey = `${CACHE_PREFIX}${cacheKey}`;
    const timestamp = Date.now();
    
    try {
      localStorage.setItem(fullKey, JSON.stringify(data));
      setTimestamps(prev => new Map(prev.set(cacheKey, timestamp)));
      setCache(prev => new Map(prev.set(cacheKey, data)));
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  }, []);

  // Limpiar cache
  const clearCache = useCallback((cacheKey = null) => {
    if (cacheKey) {
      const fullKey = `${CACHE_PREFIX}${cacheKey}`;
      localStorage.removeItem(fullKey);
      setTimestamps(prev => {
        const newTimestamps = new Map(prev);
        newTimestamps.delete(cacheKey);
        return newTimestamps;
      });
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(cacheKey);
        return newCache;
      });
    } else {
      // Limpiar todo el cache
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      setTimestamps(new Map());
      setCache(new Map());
    }
  }, []);

  // Limpiar cache expirado
  const cleanupExpiredCache = useCallback(() => {
    const now = Date.now();
    const expiredKeys = [];
    
    timestamps.forEach((timestamp, key) => {
      if (now - timestamp >= ttl) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => clearCache(key));
  }, [timestamps, ttl, clearCache]);

  // Limpiar cache expirado al montar el componente
  useEffect(() => {
    cleanupExpiredCache();
  }, [cleanupExpiredCache]);

  return {
    getCachedData,
    setCachedData,
    clearCache,
    cleanupExpiredCache,
    cache: Object.fromEntries(cache),
    timestamps: Object.fromEntries(timestamps)
  };
};

// Hook específico para reportes
export const useReportsCache = () => {
  const { getCachedData, setCachedData, clearCache } = useCache('reports', 2 * 60 * 1000); // 2 minutos

  const getCachedReports = useCallback((filters = {}) => {
    const cacheKey = `reports_${JSON.stringify(filters)}`;
    return getCachedData(cacheKey);
  }, [getCachedData]);

  const setCachedReports = useCallback((reports, filters = {}) => {
    const cacheKey = `reports_${JSON.stringify(filters)}`;
    setCachedData(cacheKey, reports);
  }, [setCachedData]);

  const clearReportsCache = useCallback(() => {
    clearCache('reports');
  }, [clearCache]);

  return {
    getCachedReports,
    setCachedReports,
    clearReportsCache
  };
};

// Hook específico para usuarios
export const useUsersCache = () => {
  const { getCachedData, setCachedData, clearCache } = useCache('users', 10 * 60 * 1000); // 10 minutos

  const getCachedUsers = useCallback(() => {
    return getCachedData('users');
  }, [getCachedData]);

  const setCachedUsers = useCallback((users) => {
    setCachedData('users', users);
  }, [setCachedData]);

  const clearUsersCache = useCallback(() => {
    clearCache('users');
  }, [clearCache]);

  return {
    getCachedUsers,
    setCachedUsers,
    clearUsersCache
  };
}; 