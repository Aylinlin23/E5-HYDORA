import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import Typography from '../ui/Typography';
import Card from '../ui/Card';

const HelpPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Primeros Pasos' },
    { id: 'citizen-guide', title: 'GuÃ­a Ciudadanos' },
    { id: 'authority-guide', title: 'GuÃ­a Autoridades' },
    { id: 'features', title: 'Funciones' },
    { id: 'testing', title: 'Pruebas' }
  ];

  const renderContent: React.FC = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <Typography variant="h3">Bienvenido a Hydora</Typography>
            <Typography variant="body">
              Plataforma para reportar y gestionar problemas en la ciudad.
            </Typography>
          </div>
        );
      
      case 'citizen-guide':
        return (
          <div>
            <Typography variant="h3">GuÃ­a para Ciudadanos</Typography>
            <Typography variant="body">
              â€¢ Crear Reporte: Completa el formulario con ubicaciÃ³n y descripciÃ³n
              â€¢ Mis Reportes: Revisa el estado de tus reportes
              â€¢ Mapa: Explora reportes cercanos
            </Typography>
          </div>
        );
      
      case 'authority-guide':
        return (
          <div>
            <Typography variant="h3">GuÃ­a para Autoridades</Typography>
            <Typography variant="body">
              â€¢ GestiÃ³n de Reportes: Filtra y asigna reportes
              â€¢ Dashboard: Revisa mÃ©tricas y exporta datos
              â€¢ Notificaciones: Recibe alertas automÃ¡ticas
            </Typography>
          </div>
        );
      
      case 'features':
        return (
          <div>
            <Typography variant="h3">Funciones Avanzadas</Typography>
            <Typography variant="body">
              â€¢ Modo Oscuro: Toggle en navegaciÃ³n
              â€¢ BÃºsqueda Global: Busca desde cualquier pÃ¡gina
              â€¢ Responsive: Se adapta a mÃ³viles
              â€¢ Notificaciones: Alertas en tiempo real
            </Typography>
          </div>
        );
      
      case 'testing':
        return (
          <div>
            <Typography variant="h3">Usuarios de Prueba</Typography>
            <Card className="test-users-card">
              <Typography variant="h4">Credenciales:</Typography>
              <div className="test-user">
                <strong>Ciudadano:</strong> ciudadano@test.com / password123
              </div>
              <div className="test-user">
                <strong>Autoridad:</strong> autoridad@test.com / password123
              </div>
              <div className="test-user">
                <strong>Admin:</strong> admin@test.com / password123
              </div>
            </Card>
          </div>
        );
      
      default:
        return <Typography variant="body">Selecciona una secciÃ³n</Typography>;
    }
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-sidebar">
          <Typography variant="h2">Ayuda</Typography>
          <nav className="help-nav">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`help-nav-item ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="help-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 
