import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import Typography from '../ui/Typography';
import Button from '../ui/Button';

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const debouncedQuery = useDebounce(query, 300);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // BÃºsqueda con debounce
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        // Simular bÃºsqueda - aquÃ­ se conectarÃ­a con la API
        const mockResults = [
          { id: 1, type: 'report', title: 'Reporte #123', subtitle: 'Bache en Av. Reforma', url: '/reports/123' },
          { id: 2, type: 'report', title: 'Reporte #456', subtitle: 'Alumbrado pÃºblico', url: '/reports/456' },
          { id: 3, type: 'location', title: 'Centro HistÃ³rico', subtitle: 'Zona de reportes', url: '/map?zone=centro' },
          { id: 4, type: 'user', title: 'Juan PÃ©rez', subtitle: 'Autoridad asignada', url: '/profile/juan' }
        ].filter(item => 
          item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setResults(mockResults);
      } catch (error) {
        console.error('Error en bÃºsqueda:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // NavegaciÃ³n con teclado
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleResultClick(results[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleResultClick = (result) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'report':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'location':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'user':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-container">
        <div className="search-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar reportes, ubicaciones, usuarios..."
          className="search-input"
          aria-label="BÃºsqueda global"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="clear-button"
            aria-label="Limpiar bÃºsqueda"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="search-results" role="listbox">
          {loading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <Typography variant="body" color="secondary">
                Buscando...
              </Typography>
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={result.id}
                className={`search-result ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleResultClick(result)}
                role="option"
                aria-selected={index === activeIndex}
              >
                <div className="result-icon">
                  {getResultIcon(result.type)}
                </div>
                <div className="result-content">
                  <Typography variant="body" className="result-title">
                    {result.title}
                  </Typography>
                  <Typography variant="caption" color="secondary" className="result-subtitle">
                    {result.subtitle}
                  </Typography>
                </div>
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className="no-results">
              <Typography variant="body" color="secondary">
                No se encontraron resultados para "{query}"
              </Typography>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 
