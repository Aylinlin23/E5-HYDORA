import React, { useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAuth } from '../../store/AuthContext';
import Button from '../ui/Button';

const RestartTourButton: React.FC = () => {
  const { user } = useAuth();
  const { hasSeenTour, resetTour } = useOnboarding();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!hasSeenTour || !user) return null;

  const handleRestartTour = () => {
    resetTour(user.role);
    setShowConfirm(false);
    
    // Recargar la pÃ¡gina para iniciar el tour
    window.location.reload();
  };

  return (
    <>
      <button
        className="restart-tour-button"
        onClick={() => setShowConfirm(true)}
        title="Reiniciar tutorial"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showConfirm && (
        <div className="restart-confirm-modal">
          <div className="modal-overlay" onClick={() => setShowConfirm(false)} />
          <div className="modal-content">
                          <h3>¿Reiniciar tutorial?</h3>
            <p>Esto te mostrará nuevamente la guía paso a paso de Hydora.</p>
            <div className="modal-actions">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                icon={null}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleRestartTour}
                icon={null}
              >
                Reiniciar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestartTourButton; 
