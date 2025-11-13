import { useState, useEffect } from 'react';

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));

  // Cargar filtros desde URL al montar
  useEffect(() => {
    loadFiltersFromURL();
  }, []);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    updateURLFromFilters();
  }, [filters]);

  const loadFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = { ...initialFilters };
    
    // Cargar filtros desde URL
    Object.keys(initialFilters).forEach(key => {
      const value = params.get(key);
      if (value !== null) {
        newFilters[key] = value;
      }
    });

    setFilters(newFilters);
    setUrlParams(params);
  };

  const updateURLFromFilters = () => {
    const params = new URLSearchParams();
    
    // Agregar filtros a URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });
    
    // Actualizar URL sin recargar la página
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
    setUrlParams(params);
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const getFilterValue = (key) => {
    return filters[key] || initialFilters[key];
  };

  const setFilterValue = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    getFilterValue,
    setFilterValue,
    urlParams
  };
};

export default useFilters; 