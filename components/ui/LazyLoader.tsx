import React, { useState, useEffect, useRef } from 'react';
import Typography from './Typography';

const LazyLoader = ({ 
  children, 
  height = 200, 
  threshold = 0.1,
  placeholder = null,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad: React.FC = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-loader ${className}`}
      style={{ minHeight: height }}
    >
      {!isVisible ? (
        placeholder || (
          <div className="lazy-placeholder">
            <div className="loading-spinner"></div>
            <Typography variant="body" color="secondary">
              Cargando...
            </Typography>
          </div>
        )
      ) : (
        <div className={`lazy-content ${isLoaded ? 'loaded' : ''}`}>
          {React.cloneElement(children, { onLoad: handleLoad })}
        </div>
      )}
    </div>
  );
};

export default LazyLoader; 
