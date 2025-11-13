import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Typography from '../../ui/Typography';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const ExportModal = ({ onClose, onExport, loading }) => {
  const [exportType, setExportType] = useState('summary');
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport: React.FC = () => {
    onExport(exportType, exportFormat);
  };

  const exportOptions = [
    {
      id: 'summary',
      title: 'Resumen Ejecutivo',
      description: 'MÃ©tricas clave y grÃ¡ficos principales',
      icon: 'ðŸ“Š'
    },
    {
      id: 'detailed',
      title: 'Reporte Detallado',
      description: 'Todos los datos con anÃ¡lisis completo',
      icon: 'ðŸ“‹'
    },
    {
      id: 'critical',
      title: 'Reportes CrÃ­ticos',
      description: 'Solo reportes urgentes y crÃ­ticos',
      icon: 'ðŸš¨'
    },
    {
      id: 'timeline',
      title: 'LÃ­nea de Tiempo',
      description: 'EvoluciÃ³n de reportes por perÃ­odo',
      icon: 'ðŸ“ˆ'
    }
  ];

  const formatOptions = [
    {
      id: 'pdf',
      title: 'PDF',
      description: 'Formato profesional para presentaciones',
      icon: 'ðŸ“„'
    },
    {
      id: 'csv',
      title: 'CSV',
      description: 'Datos crudos para anÃ¡lisis',
      icon: 'ðŸ“Š'
    }
  ];

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Typography variant="h2" className="modal-title">
            Exportar Dashboard
          </Typography>
          <Button
            variant="ghost"
            onClick={onClose}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Cerrar
          </Button>
        </div>

        <div className="modal-body">
          <div className="export-options">
            {/* Tipo de exportaciÃ³n */}
            <div className="option-section">
              <Typography variant="h3" className="section-title">
                Tipo de Reporte
              </Typography>
              <div className="options-grid">
                {exportOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`option-card ${exportType === option.id ? 'selected' : ''}`}
                    onClick={() => setExportType(option.id)}
                  >
                    <div className="option-icon">{option.icon}</div>
                    <div className="option-content">
                      <Typography variant="h4" className="option-title">
                        {option.title}
                      </Typography>
                      <Typography variant="body" color="secondary" className="option-description">
                        {option.description}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Formato de exportaciÃ³n */}
            <div className="option-section">
              <Typography variant="h3" className="section-title">
                Formato
              </Typography>
              <div className="format-options">
                {formatOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`format-card ${exportFormat === option.id ? 'selected' : ''}`}
                    onClick={() => setExportFormat(option.id)}
                  >
                    <div className="format-icon">{option.icon}</div>
                    <div className="format-content">
                      <Typography variant="h4" className="format-title">
                        {option.title}
                      </Typography>
                      <Typography variant="body" color="secondary" className="format-description">
                        {option.description}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* InformaciÃ³n adicional */}
            <div className="export-info">
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="body" color="secondary">
                  El archivo se descargarÃ¡ automÃ¡ticamente
                </Typography>
              </div>
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="body" color="secondary">
                  Incluye datos actualizados hasta el momento
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={loading}
            loading={loading}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            {loading ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExportModal; 
