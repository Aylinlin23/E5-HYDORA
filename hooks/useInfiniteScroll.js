import { useState, useCallback } from 'react';
import { reportService } from '../services/api';

const useInfiniteScroll = (initialFilters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await reportService.getAll(filters, page, 10);
      
      if (response.success) {
        const newReports = response.reports || [];
        const pagination = response.pagination || {};
        
        if (page === 1) {
          // Primera carga - reemplazar todo
          setReports(newReports);
        } else {
          // Carga adicional - agregar al final
          setReports(prev => [...prev, ...newReports]);
        }
        
        // Verificar si hay más páginas
        setHasMore(pagination.currentPage < pagination.totalPages);
        setPage(prev => prev + 1);
      } else {
        setError(response.message || 'Error al cargar reportes');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Error de conexión. Verifica tu conexión a internet.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters]);

  const refresh = useCallback(async (newFilters = filters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    setReports([]);
    setError(null);
    
    // Cargar primera página
    setLoading(true);
    try {
      const response = await reportService.getAll(newFilters, 1, 10);
      
      if (response.success) {
        const newReports = response.reports || [];
        const pagination = response.pagination || {};
        
        setReports(newReports);
        setHasMore(pagination.currentPage < pagination.totalPages);
        setPage(2); // Siguiente página será 2
      } else {
        setError(response.message || 'Error al cargar reportes');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error refreshing reports:', error);
      setError('Error de conexión. Verifica tu conexión a internet.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    refresh(newFilters);
  }, [refresh]);

  return {
    reports,
    loading,
    hasMore,
    error,
    filters,
    loadMore,
    refresh,
    updateFilters
  };
};

export default useInfiniteScroll; 