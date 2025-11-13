import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DropIcon } from '../ui/Icons';

const QuickAccessButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // No mostrar en páginas específicas donde no es necesario
  const hiddenPaths = ['/login', '/register', '/guide', '/water-guides'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleClick = () => {
    navigate('/guide');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        cursor: 'pointer'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: '#1F2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          Guías de cuidado del agua
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '16px',
              width: '8px',
              height: '8px',
              backgroundColor: '#1F2937',
              transform: 'rotate(45deg)'
            }}
          />
        </div>
      )}

      {/* Botón principal */}
      <div
        style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#22C55E',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          border: '3px solid white'
        }}
      >
        <span
          style={{
            fontSize: '24px',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        >
          <DropIcon size={22} />
        </span>
      </div>

      {/* Efecto de pulso */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#22C55E',
          opacity: 0.3,
          animation: 'pulse 2s infinite',
          pointerEvents: 'none'
        }}
      />

      <style>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickAccessButton;