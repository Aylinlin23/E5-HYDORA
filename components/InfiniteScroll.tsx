import { useEffect, useRef, useCallback } from 'react';

const InfiniteScroll = ({ 
  children, 
  onLoadMore, 
  hasMore, 
  loading, 
  threshold = 100,
  className = '' 
}) => {
  const observerRef = useRef();
  const loadingRef = useRef(null);

  const lastElementRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, {
      rootMargin: `${threshold}px`
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={className}>
      {children}
      
      {/* Elemento de carga al final */}
      {hasMore && (
        <div ref={lastElementRef} className="py-4 text-center">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Cargando mÃ¡s reportes...
              </span>
            </div>
          ) : (
            <div className="h-8"></div> // Espacio invisible para trigger
          )}
        </div>
      )}
      
      {/* Mensaje cuando no hay mÃ¡s elementos */}
      {!hasMore && (
        <div className="py-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay mÃ¡s reportes para mostrar
          </p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll; 
