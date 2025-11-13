import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ reports, visible = false }) => {
  const map = useMap();
  const heatmapRef = useRef(null);

  useEffect(() => {
    if (!visible || !reports.length) return;

    // Filtrar solo reportes sin atender para el heatmap
    const heatmapData = reports
      .filter(report => report.status === 'sin_atender')
      .map(report => [
        report.latitude,
        report.longitude,
        1 // Intensidad base
      ]);

    if (heatmapData.length === 0) return;

    // Crear capa de heatmap
    const heatmapLayer = L.heatLayer(heatmapData, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: '#FF6B6B',
        0.6: '#FF5252',
        0.8: '#FF1744',
        1.0: '#D50000'
      }
    });

    heatmapLayer.addTo(map);
    heatmapRef.current = heatmapLayer;

    return () => {
      if (heatmapRef.current) {
        map.removeLayer(heatmapRef.current);
        heatmapRef.current = null;
      }
    };
  }, [reports, visible, map]);

  useEffect(() => {
    if (heatmapRef.current) {
      if (visible) {
        map.addLayer(heatmapRef.current);
      } else {
        map.removeLayer(heatmapRef.current);
      }
    }
  }, [visible, map]);

  return null;
};

export default HeatmapLayer; 
