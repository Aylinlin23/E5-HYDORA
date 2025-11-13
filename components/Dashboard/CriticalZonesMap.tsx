import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CriticalZonesMap = ({ data }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Configurar el mapa
    const map = L.map(mapRef.current).setView([19.4326, -99.1332], 11); // Ciudad de MÃ©xico

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Â© OpenStreetMap contributors'
    }).addTo(map);

    // Agregar zonas crÃ­ticas
    data.forEach(zone => {
      const circle = L.circle([zone.lat, zone.lng], {
        color: zone.criticalCount > 5 ? '#EF4444' : '#F59E0B',
        fillColor: zone.criticalCount > 5 ? '#EF4444' : '#F59E0B',
        fillOpacity: 0.6,
        radius: Math.max(zone.criticalCount * 100, 200)
      }).addTo(map);

      // Popup con informaciÃ³n de la zona
      const popupContent = `
        <div class="zone-popup">
          <h4>${zone.name}</h4>
          <p><strong>Reportes crÃ­ticos:</strong> ${zone.criticalCount}</p>
          <p><strong>Total reportes:</strong> ${zone.totalReports}</p>
          <p><strong>Ãšltimo reporte:</strong> ${new Date(zone.lastReport).toLocaleDateString()}</p>
        </div>
      `;

      circle.bindPopup(popupContent);

      // Efecto de pulso para zonas muy crÃ­ticas
      if (zone.criticalCount > 10) {
        const pulseCircle = L.circle([zone.lat, zone.lng], {
          color: '#EF4444',
          fillColor: '#EF4444',
          fillOpacity: 0.2,
          radius: Math.max(zone.criticalCount * 100, 200) + 50
        }).addTo(map);

        // AnimaciÃ³n de pulso
        let growing = true;
        setInterval(() => {
          const currentRadius = pulseCircle.getRadius();
          if (growing) {
            pulseCircle.setRadius(currentRadius + 10);
            if (currentRadius > Math.max(zone.criticalCount * 100, 200) + 100) {
              growing = false;
            }
          } else {
            pulseCircle.setRadius(currentRadius - 10);
            if (currentRadius < Math.max(zone.criticalCount * 100, 200) + 50) {
              growing = true;
            }
          }
        }, 100);
      }
    });

    // Ajustar vista para mostrar todas las zonas
    if (data.length > 0) {
      const group = new L.featureGroup(data.map(zone => 
        L.circle([zone.lat, zone.lng], { radius: 1 })
      ));
      map.fitBounds(group.getBounds().pad(0.1));
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="critical-zones-map">
      <div ref={mapRef} className="map-container" style={{ height: '300px' }} />
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color critical-high"></div>
                      <span>Alta criticidad (&gt;5 reportes)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color critical-medium"></div>
          <span>Media criticidad (1-5 reportes)</span>
        </div>
      </div>
    </div>
  );
};

export default CriticalZonesMap; 
