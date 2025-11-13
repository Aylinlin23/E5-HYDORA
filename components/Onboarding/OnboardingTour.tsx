import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../store/AuthContext';
import Button from '../ui/Button';
import Typography from '../ui/Typography';

const OnboardingTour: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const tooltipRef = useRef(null);
  const overlayRef = useRef(null);

  // ConfiguraciÃ³n del tour por rol
  const tourConfig = {
    citizen: [
      {
        id: 'create-report',
        target: '[data-tour="create-report"]',
        title: 'Crear Reporte',
        description: 'AquÃ­ puedes reportar una nueva fuga de agua. Haz clic para abrir el formulario.',
        position: 'bottom'
      },
      {
        id: 'my-reports',
        target: '[data-tour="my-reports"]',
        title: 'Mis Reportes',
        description: 'Revisa el estado de todos tus reportes y su historial de actualizaciones.',
        position: 'bottom'
      },
      {
        id: 'reuse-guide',
        target: '[data-tour="reuse-guide"]',
        title: 'GuÃ­a de ReÃºso',
        description: 'Aprende cÃ³mo reutilizar el agua mientras se resuelve tu reporte.',
        position: 'left'
      },
      {
        id: 'notifications',
        target: '[data-tour="notifications"]',
        title: 'Notificaciones',
        description: 'Recibe actualizaciones en tiempo real sobre el estado de tus reportes.',
        position: 'bottom'
      }
    ],
    authority: [
      {
        id: 'reports-panel',
        target: '[data-tour="reports-panel"]',
        title: 'Panel de Reportes',
        description: 'Gestiona todos los reportes pendientes y en proceso desde aquÃ­.',
        position: 'bottom'
      },
      {
        id: 'filters',
        target: '[data-tour="filters"]',
        title: 'Filtros Avanzados',
        description: 'Filtra reportes por estado, zona, prioridad y otros criterios.',
        position: 'left'
      },
      {
        id: 'assign-status',
        target: '[data-tour="assign-status"]',
        title: 'Asignar/Cambiar Estado',
        description: 'Asigna reportes a tÃ©cnicos o cambia su estado de resoluciÃ³n.',
        position: 'right'
      },
      {
        id: 'dashboard',
        target: '[data-tour="dashboard"]',
        title: 'Dashboard',
        description: 'Visualiza estadÃ­sticas y mÃ©tricas del sistema en tiempo real.',
        position: 'bottom'
      }
    ],
    admin: [
      {
        id: 'admin-panel',
        target: '[data-tour="admin-panel"]',
        title: 'Panel de AdministraciÃ³n',
        description: 'Gestiona usuarios, roles y configuraciones del sistema.',
        position: 'bottom'
      },
      {
        id: 'user-management',
        target: '[data-tour="user-management"]',
        title: 'GestiÃ³n de Usuarios',
        description: 'Crea, edita y gestiona cuentas de usuarios y autoridades.',
        position: 'left'
      },
      {
        id: 'system-stats',
        target: '[data-tour="system-stats"]',
        title: 'EstadÃ­sticas del Sistema',
        description: 'Monitorea el rendimiento y uso del sistema.',
        position: 'right'
      }
    ]
  };

  const currentTour = tourConfig[user?.role] || [];
  const currentStepData = currentTour[currentStep];

  useEffect(() => {
    // Verificar si es el primer login y si debe mostrar el tour
    const hasSeenTour = localStorage.getItem(`hydora-tour-${user?.role}`);
    const shouldShowTour = !hasSeenTour && user;
    
    if (shouldShowTour) {
      setShowTour(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, [user]);

  useEffect(() => {
    if (!showTour || !currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (!targetElement) return;

    // Posicionar el tooltip
    positionTooltip(targetElement, currentStepData.position);
    
    // Resaltar el elemento objetivo
    highlightElement(targetElement);
  }, [currentStep, showTour, currentStepData]);

  const positionTooltip = (targetElement, position) => {
    if (!tooltipRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const overlayRect = overlayRef.current?.getBoundingClientRect();

    let top, left;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + 10;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + 10;
        break;
      default:
        top = targetRect.bottom + 10;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
    }

    // Asegurar que el tooltip estÃ© dentro de la ventana
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = window.innerHeight - tooltipRect.height - 10;
    }

    tooltipRef.current.style.top = `${top}px`;
    tooltipRef.current.style.left = `${left}px`;
  };

  const highlightElement = (element) => {
    // Remover resaltado anterior
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });

    // Aplicar resaltado al elemento actual
    element.classList.add('tour-highlight');
  };

  const nextStep: React.FC = () => {
    if (currentStep < currentTour.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const previousStep: React.FC = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour: React.FC = () => {
    finishTour();
  };

  const finishTour: React.FC = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowTour(false);
      setCurrentStep(0);
      
      // Remover resaltado
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });

      // Guardar preferencia
      if (dontShowAgain) {
        localStorage.setItem(`hydora-tour-${user?.role}`, 'completed');
      }
    }, 300);
  };

  if (!showTour || !currentStepData) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className={`tour-overlay ${isVisible ? 'visible' : ''}`}
        onClick={nextStep}
      />

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className={`tour-tooltip ${isVisible ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tooltip-header">
          <Typography variant="h3" className="tooltip-title">
            {currentStepData.title}
          </Typography>
          <div className="tooltip-progress">
            {currentStep + 1} de {currentTour.length}
          </div>
        </div>

        <Typography variant="body" className="tooltip-description">
          {currentStepData.description}
        </Typography>

        <div className="tooltip-actions">
          <div className="tooltip-checkbox">
            <input
              type="checkbox"
              id="dont-show-again"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <label htmlFor="dont-show-again">
              No mostrar de nuevo
            </label>
          </div>

          <div className="tooltip-buttons">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="skip-button"
            >
              Omitir
            </Button>
            
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                className="prev-button"
              >
                Anterior
              </Button>
            )}
            
            <Button
              variant="primary"
              size="sm"
              onClick={nextStep}
              className="next-button"
            >
              {currentStep === currentTour.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </div>

        {/* Flecha del tooltip */}
        <div className={`tooltip-arrow tooltip-arrow-${currentStepData.position}`} />
      </div>
    </>,
    document.body
  );
};

export default OnboardingTour; 
