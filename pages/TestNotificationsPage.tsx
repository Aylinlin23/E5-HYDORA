import React from 'react';
import { useNotifications } from '../store/NotificationContext';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CommentSection from '../components/Comments/CommentSection';
import CriticalAlert from '../components/Alerts/CriticalAlert';

const TestNotificationsPage: React.FC = () => {
  const { showToast, sendNotification } = useNotifications();

  const testReport = {
    id: 123,
    status: 'sin_atender',
    timeSinceCreation: 72 * 60, // 72 horas
    location: 'Av. Reforma 123, CDMX'
  };

  const handleTestToast = (type) => {
    const messages = {
      success: { title: 'Ã‰xito', message: 'OperaciÃ³n completada correctamente' },
      error: { title: 'Error', message: 'Algo saliÃ³ mal' },
      warning: { title: 'Advertencia', message: 'AtenciÃ³n requerida' },
      info: { title: 'InformaciÃ³n', message: 'Nueva actualizaciÃ³n disponible' }
    };

    const { title, message } = messages[type];
    showToast(title, message, type);
  };

  const handleTestNotification = async () => {
    try {
      await sendNotification(1, {
        title: 'Nuevo reporte asignado',
        body: 'Se te ha asignado el reporte #123',
        type: 'assignment',
        data: {
          url: '/reports/123'
        }
      });
      showToast('NotificaciÃ³n enviada', 'Se ha enviado una notificaciÃ³n de prueba', 'success');
    } catch (error) {
      showToast('Error', 'No se pudo enviar la notificaciÃ³n', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <Typography variant="h1" className="page-title">
                Prueba de Notificaciones
              </Typography>
              <Typography variant="body" color="secondary" className="page-subtitle">
                Prueba las funcionalidades de notificaciones, comentarios y alertas
              </Typography>
            </div>
          </div>
        </div>

        <div className="test-sections">
          {/* Prueba de Toast Notifications */}
          <Card className="test-section">
            <Typography variant="h3" className="section-title">
              Toast Notifications
            </Typography>
            <Typography variant="body" color="secondary" className="section-description">
              Prueba los diferentes tipos de notificaciones toast
            </Typography>
            
            <div className="test-buttons">
              <Button
                variant="primary"
                onClick={() => handleTestToast('success')}
              >
                Toast de Ã‰xito
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTestToast('error')}
              >
                Toast de Error
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTestToast('warning')}
              >
                Toast de Advertencia
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTestToast('info')}
              >
                Toast de InformaciÃ³n
              </Button>
            </div>
          </Card>

          {/* Prueba de Notificaciones Push */}
          <Card className="test-section">
            <Typography variant="h3" className="section-title">
              Notificaciones Push
            </Typography>
            <Typography variant="body" color="secondary" className="section-description">
              Prueba el envÃ­o de notificaciones push
            </Typography>
            
            <div className="test-buttons">
              <Button
                variant="primary"
                onClick={handleTestNotification}
              >
                Enviar NotificaciÃ³n Push
              </Button>
            </div>
          </Card>

          {/* Prueba de Alertas CrÃ­ticas */}
          <Card className="test-section">
            <Typography variant="h3" className="section-title">
              Alertas CrÃ­ticas
            </Typography>
            <Typography variant="body" color="secondary" className="section-description">
              VisualizaciÃ³n de alertas para reportes crÃ­ticos
            </Typography>
            
            <CriticalAlert 
              report={testReport}
              onViewReport={(id) => console.log('Ver reporte:', id)}
            />
          </Card>

          {/* Prueba de Comentarios */}
          <Card className="test-section">
            <Typography variant="h3" className="section-title">
              Sistema de Comentarios
            </Typography>
            <Typography variant="body" color="secondary" className="section-description">
              Prueba el sistema de comentarios bidireccional
            </Typography>
            
            <CommentSection reportId={123} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestNotificationsPage; 
