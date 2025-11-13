import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAuth } from '../../store/AuthContext';
import { reportService } from '../../services/api';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import HeatmapLayer from './HeatmapLayer';

// Iconos personalizados para marcadores
const createCustomIcon = (status, isCritical = false) => {
  const colors = {
    'sin_atender': '#EF4444',
    'en_proceso': '#F59E0B',
    'resuelto': '#22C55E'
  };

  const color = colors[status] || '#6B7280';
  
  return L.divIcon({
    html: `
      <div class="custom-marker ${isCritical ? 'critical-pulse' : ''}" 
           style="
             background-color: ${color};
             width: 24px;
             height: 24px;
             border-radius: 50%;
             border: 3px solid white;
             box-shadow: 0 2px 8px rgba(0,0,0,0.3);
             display: flex;
             align-items: center;
             justify-content: center;
             color: white;
             font-weight: bold;
             font-size: 12px;
           ">
        ${isCritical ? '!' : ''}
      </div>
    `,
    className: 'custom-marker-container',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Componente para actualizaciÃ³n incremental
const MapUpdater = ({ reports, onReportUpdate }) => {
  const map = useMap();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await reportService.getReports({
          updatedAfter: lastUpdate
        });
        
        if (response.success && response.data.length > 0) {
          onReportUpdate(response.data);
          setLastUpdate(Date.now());
        }
      } catch (error) {
        console.error('Error updating map:', error);
      }
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [lastUpdate, onReportUpdate]);

  return null;
};

// Componente para controles del mapa
const MapControls = ({ showHeatmap, onToggleHeatmap, onToggleFilters }) => {
  return (
    <div className="map-controls">
      <Button
        variant={showHeatmap ? "primary" : "outline"}
        size="sm"
        onClick={onToggleHeatmap}
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        }
      >
        {showHeatmap ? 'Ocultar' : 'Mostrar'} Heatmap
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFilters}
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
        }
      >
        Filtros
      </Button>
    </div>
  );
};

// Componente para el botÃ³n flotante "Reportar aquÃ­"
const ReportHereButton = ({ onActivate }) => {
  return (
    <div className="report-here-button">
      <Button
        variant="primary"
        size="lg"
        onClick={onActivate}
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
      >
        Reportar aquÃ­
      </Button>
    </div>
  );
};

// Componente para filtros
const MapFilters = ({ filters, onFilterChange, visible }) => {
  if (!visible) return null;

  return (
    <Card className="map-filters">
      <Typography variant="h3" className="filters-title">Filtros</Typography>
      
      <div className="filter-group">
        <label className="filter-label">Estado</label>
        <select 
          value={filters.status} 
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="hydora-input"
        >
          <option value="">Todos</option>
          <option value="sin_atender">Sin atender</option>
          <option value="en_proceso">En proceso</option>
          <option value="resuelto">Resuelto</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Radio de proximidad</label>
        <input
          type="range"
          min="0"
          max="10"
          value={filters.radius}
          onChange={(e) => onFilterChange('radius', e.target.value)}
          className="range-slider"
        />
        <span className="radius-value">{filters.radius} km</span>
      </div>

      <div className="filter-group">
        <label className="filter-label">Zona/Colonia</label>
        <input
          type="text"
          value={filters.zone}
          onChange={(e) => onFilterChange('zone', e.target.value)}
          placeholder="Buscar zona..."
          className="hydora-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">BÃºsqueda libre</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="ID o texto..."
          className="hydora-input"
        />
      </div>

      <div className="filter-actions">
        <Button variant="outline" onClick={() => onFilterChange('reset')}>
          Limpiar filtros
        </Button>
      </div>
    </Card>
  );
};

// Componente para leyenda
const MapLegend: React.FC = () => {
  return (
    <Card className="map-legend">
      <Typography variant="h3" className="legend-title">Leyenda</Typography>
      
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-marker critical"></div>
          <span>CrÃ­tico (48h+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker sin-atender"></div>
          <span>Sin atender</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker en-proceso"></div>
          <span>En proceso</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker resuelto"></div>
          <span>Resuelto</span>
        </div>
      </div>

      <div className="legend-help">
        <Button variant="ghost" size="sm" className="help-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
    </Card>
  );
};

// Popup enriquecido
const EnrichedPopup = ({ report, userRole, onAction }) => {
  const isAuthority = userRole === 'authority' || userRole === 'admin';
  const isCritical = new Date() - new Date(report.createdAt) > 48 * 60 * 60 * 1000;

  return (
    <div className="enriched-popup">
      <div className="popup-header">
        <Typography variant="h3" className="popup-title">
          Reporte #{report.id}
        </Typography>
        <div className={`popup-status ${report.status}`}>
          {report.status === 'sin_atender' && isCritical && (
            <span className="critical-indicator">Â¡CRÃTICO!</span>
          )}
          <span className="status-text">{report.status}</span>
        </div>
      </div>

      <div className="popup-content">
        <div className="popup-info">
          <Typography variant="body" className="popup-description">
            {report.description}
          </Typography>
          
          <div className="popup-details">
            <div className="detail-item">
              <span className="detail-label">Fecha:</span>
              <span className="detail-value">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {report.assignedTo && (
              <div className="detail-item">
                <span className="detail-label">Asignado a:</span>
                <span className="detail-value">{report.assignedTo.name}</span>
              </div>
            )}
            
            <div className="detail-item">
              <span className="detail-label">Prioridad:</span>
              <span className={`detail-value priority-${report.priority}`}>
                {report.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAction('view', report.id)}
            className="action-button"
          >
            Ver detalle
          </Button>

          {isAuthority && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAction('assign', report.id)}
                className="action-button"
              >
                Asignar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction('changeStatus', report.id)}
                className="action-button"
              >
                Cambiar estado
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdvancedMap: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    radius: 5,
    zone: '',
    search: ''
  });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [reportHereMode, setReportHereMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Cargar reportes iniciales
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // ActualizaciÃ³n incremental
  const handleReportUpdate = useCallback((newReports) => {
    setReports(prevReports => {
      const updatedReports = [...prevReports];
      
      newReports.forEach(newReport => {
        const existingIndex = updatedReports.findIndex(r => r.id === newReport.id);
        if (existingIndex >= 0) {
          updatedReports[existingIndex] = newReport;
        } else {
          updatedReports.push(newReport);
        }
      });
      
      return updatedReports;
    });
  }, []);

  // Filtrar reportes
  const filteredReports = reports.filter(report => {
    if (filters.status && report.status !== filters.status) return false;
    if (filters.zone && !report.location.toLowerCase().includes(filters.zone.toLowerCase())) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        report.id.toString().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm) ||
        report.location.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  // Manejar acciones de popup
  const handlePopupAction = (action, reportId) => {
    switch (action) {
      case 'view':
        // Navegar al detalle del reporte
        window.location.href = `/reports/${reportId}`;
        break;
      case 'assign':
        // Abrir modal de asignaciÃ³n
        console.log('Asignar reporte:', reportId);
        break;
      case 'changeStatus':
        // Abrir modal de cambio de estado
        console.log('Cambiar estado:', reportId);
        break;
      default:
        break;
    }
  };

  // Activar modo "Reportar aquÃ­"
  const handleReportHere: React.FC = () => {
    setReportHereMode(true);
    // AquÃ­ se implementarÃ­a la lÃ³gica para colocar el pin editable
  };

  return (
    <div className="advanced-map-container">
      <div className="map-sidebar">
        <MapFilters 
          filters={filters} 
          visible={showFilters}
          onFilterChange={(key, value) => {
            if (key === 'reset') {
              setFilters({
                status: '',
                radius: 5,
                zone: '',
                search: ''
              });
            } else {
              setFilters(prev => ({ ...prev, [key]: value }));
            }
          }}
        />
        
        <MapLegend />
      </div>

      <div className="map-main">
        <MapContainer
          center={[19.4326, -99.1332]} // Ciudad de MÃ©xico
          zoom={13}
          className="advanced-map"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Heatmap Layer */}
          <HeatmapLayer 
            reports={filteredReports} 
            visible={showHeatmap} 
          />

          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={true}
            zoomToBoundsOnClick={true}
          >
            {filteredReports.map(report => {
              const isCritical = new Date() - new Date(report.createdAt) > 48 * 60 * 60 * 1000;
              
              return (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                  icon={createCustomIcon(report.status, isCritical && report.status === 'sin_atender')}
                >
                  <Popup>
                    <EnrichedPopup
                      report={report}
                      userRole={user?.role}
                      onAction={handlePopupAction}
                    />
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>

          <MapUpdater reports={reports} onReportUpdate={handleReportUpdate} />
        </MapContainer>

        <MapControls 
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <ReportHereButton onActivate={handleReportHere} />
      </div>
    </div>
  );
};

export default AdvancedMap; 
