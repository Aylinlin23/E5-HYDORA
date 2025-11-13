import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LocationIcon, MapIcon, DocumentIcon, EyeIcon } from '../ui/Icons';
import { reportService } from '../services/api';
      // Filtro de proximidad
      let matchesProximity = true;
      if (filters.proximity !== 'all' && userLocation) {
        const distance = getDistance(
          userLocation.lat, userLocation.lng,
          report.latitude, report.longitude
        );
        const maxDistance = filters.proximity === '1km' ? 1 : 
                           filters.proximity === '5km' ? 5 : 10;
        matchesProximity = distance <= maxDistance;
      }

      return matchesStatus && matchesPriority && matchesAssigned && matchesCritical && matchesProximity;
    });
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    updateClusters();
  }, [reports, filters, mapCenter]);

  const loadMapData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos del mapa
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockReports: MapReport[] = [
        {
          id: '1',
          title: 'Fuga en Reforma y Juárez',
          description: 'Fuga importante en la esquina de Reforma y Juárez, el agua está corriendo por la calle.',
          status: 'PENDING',
          priority: 'HIGH',
          latitude: 19.4326,
          longitude: -99.1332,
          address: 'Reforma y Juárez, Centro',
          createdAt: '2024-08-02T10:30:00Z',
          updatedAt: '2024-08-02T10:30:00Z',
          category: 'Fuga de Agua',
          citizenName: 'María González',
          citizenPhone: '555-0123',
          isCritical: true,
          jurisdiction: 'Centro'
        },
        {
          id: '2',
          title: 'Desbordamiento Insurgentes',
          description: 'La alcantarilla está desbordándose y hay agua estancada en la calle.',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          latitude: 19.4000,
          longitude: -99.1500,
          address: 'Av. Insurgentes 123',
          createdAt: '2024-08-01T15:45:00Z',
          updatedAt: '2024-08-02T09:15:00Z',
          category: 'Alcantarillado',
          assignedTo: 'Equipo de Emergencias',
          citizenName: 'Carlos Rodríguez',
          citizenPhone: '555-0456',
          isCritical: true,
          jurisdiction: 'Insurgentes'
        },
        {
          id: '3',
          title: 'Fuga menor en Parque',
          description: 'Pequeña fuga en el sistema de riego del parque.',
          status: 'RESOLVED',
          priority: 'LOW',
          latitude: 19.4200,
          longitude: -99.1200,
          address: 'Parque Central',
          createdAt: '2024-07-30T08:20:00Z',
          updatedAt: '2024-08-01T14:30:00Z',
          category: 'Riego',
          assignedTo: 'Mantenimiento',
          citizenName: 'Ana López',
          citizenPhone: '555-0789',
          isCritical: false,
          jurisdiction: 'Centro'
        },
        {
          id: '4',
          title: 'Fuga en Condesa',
          description: 'Fuga moderada en tubería principal de la zona.',
          status: 'PENDING',
          priority: 'MEDIUM',
          latitude: 19.4100,
          longitude: -99.1700,
          address: 'Condesa, CDMX',
          createdAt: '2024-08-02T14:20:00Z',
          updatedAt: '2024-08-02T14:20:00Z',
          category: 'Fuga de Agua',
          citizenName: 'Luis Martínez',
          citizenPhone: '555-0321',
          isCritical: false,
          jurisdiction: 'Condesa'
        },
        {
          id: '5',
          title: 'Desbordamiento Roma',
          description: 'Desbordamiento en alcantarilla de Roma Norte.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          latitude: 19.4150,
          longitude: -99.1600,
          address: 'Roma Norte',
          createdAt: '2024-08-01T09:15:00Z',
          updatedAt: '2024-08-02T11:30:00Z',
          category: 'Alcantarillado',
          assignedTo: 'Equipo Técnico',
          citizenName: 'Patricia Sánchez',
          citizenPhone: '555-0654',
          isCritical: true,
          jurisdiction: 'Roma'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Error cargando datos del mapa:', error);
    } finally {
      setLoading(false);
    }
  };

  const startIncrementalUpdates = () => {
    updateIntervalRef.current = setInterval(() => {
      // Re-cargar datos periódicamente
      console.log('Actualizando datos del mapa...');
      loadMapData();
    }, 30000); // Cada 30 segundos
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  const updateClusters = () => {
    const filteredReports = getFilteredReports();
    const newClusters: Cluster[] = [];
    
    // Algoritmo simple de clustering
    const clusterRadius = 0.01; // Aproximadamente 1km
    
    filteredReports.forEach(report => {
      let addedToCluster = false;
      
      for (const cluster of newClusters) {
        const distance = Math.sqrt(
          Math.pow(report.latitude - cluster.latitude, 2) +
          Math.pow(report.longitude - cluster.longitude, 2)
        );
        
        if (distance < clusterRadius) {
          cluster.reports.push(report);
          cluster.count++;
          addedToCluster = true;
          break;
        }
      }
      
      if (!addedToCluster) {
        newClusters.push({
          id: `cluster-${report.id}`,
          latitude: report.latitude,
          longitude: report.longitude,
          count: 1,
          reports: [report]
        });
      }
    });
    
    setClusters(newClusters);
  };

  const getFilteredReports = () => {
    return reports.filter(report => {
      const matchesStatus = filters.status === 'all' || report.status === filters.status;
      const matchesPriority = filters.priority === 'all' || report.priority === filters.priority;
      const matchesAssigned = filters.assignedTo === 'all' || 
        (filters.assignedTo === 'me' && report.assignedTo === user?.name) ||
        (filters.assignedTo === 'others' && report.assignedTo && report.assignedTo !== user?.name) ||
        (filters.assignedTo === 'unassigned' && !report.assignedTo);
      const matchesCritical = !filters.showCritical || report.isCritical;
      
      // Filtro de proximidad
      let matchesProximity = true;
      if (filters.proximity !== 'all' && userLocation) {
        const distance = getDistance(
          userLocation.lat, userLocation.lng,
          report.latitude, report.longitude
        );
        const maxDistance = filters.proximity === '1km' ? 1 : 
                           filters.proximity === '5km' ? 5 : 10;
        matchesProximity = distance <= maxDistance;
      }
      
            // Construir filtros para la API
            const apiFilters: any = {};
            if (filters.status && filters.status !== 'all') apiFilters.status = filters.status;
            if (filters.priority && filters.priority !== 'all') apiFilters.priority = filters.priority;

            // Proximidad: enviar lat/lng/radius si aplica
            if (filters.proximity !== 'all' && userLocation) {
              const radius = filters.proximity === '1km' ? 1 : filters.proximity === '5km' ? 5 : 10;
              apiFilters.lat = userLocation.lat;
              apiFilters.lng = userLocation.lng;
              apiFilters.radius = radius;
            }

            // Llamar al servicio apropiado según rol
            let res: any;
            if (user?.role === 'CITIZEN') {
              res = await reportService.getUserReports(apiFilters);
            } else {
              res = await reportService.getReports(apiFilters);
            }

            const list = res?.reports || res?.data || res?.data?.reports || [];
            // Normalizar y asegurar campos necesarios
            const normalized: MapReport[] = list.map((r: any) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              status: r.status,
              priority: r.priority,
              latitude: r.latitude,
              longitude: r.longitude,
              address: r.address || '',
              createdAt: r.createdAt,
              updatedAt: r.updatedAt,
              category: r.category || '',
              assignedTo: r.assignedTo || undefined,
              citizenName: r.user?.name || undefined,
              citizenPhone: r.user?.phone || undefined,
              photos: r.photos ? (Array.isArray(r.photos) ? r.photos : String(r.photos).split(',')) : [],
              isCritical: (() => {
                try {
                  const created = new Date(r.createdAt);
                  const diffH = (Date.now() - created.getTime()) / (1000 * 60 * 60);
                  return r.status === 'PENDING' && diffH > 48;
                } catch (e) { return false; }
              })(),
              jurisdiction: r.jurisdiction || ''
            }));

            setReports(normalized);
          longitude: lng 
        } 
      });
      setIsCreatingReport(false);
    }
  };

  const handleMyLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(15);
    } else {
      getUserLocation();
    }
  };

  const resetFilters = async () => {
    setFilters({
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
      proximity: 'all',
      showHeatmap: false,
      showCritical: false
    });
    // recargar datos
    await loadMapData();
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      // Optimistic update
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: newStatus as any, updatedAt: new Date().toISOString() } : r
      ));
      setSelectedReport(prev => prev?.id === reportId ? { ...prev, status: newStatus as any } : prev);

      // Persistir en backend
      const res = await reportService.update(reportId, { status: newStatus });
      if (!res || !res.success) {
        // Revertir (simple) y recargar
        console.warn('No se pudo actualizar el estado en el servidor, recargando...');
        await loadMapData();
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleAssignReport = async (reportId: string, assignedTo: string) => {
    try {
      // Optimistic: marcar asignado localmente
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, assignedTo, updatedAt: new Date().toISOString() } : r
      ));
      setSelectedReport(prev => prev?.id === reportId ? { ...prev, assignedTo } : prev);

      // Intentar persistir como cambio de estado a IN_PROGRESS (si aplica)
      // Nota: endpoint de asignación por usuario no está implementado explícitamente;
      // hacemos una actualización de estado cuando se asigna para reflejar que alguien lo atiende.
      if (assignedTo) {
        const res = await reportService.update(reportId, { status: 'IN_PROGRESS' });
        if (!res || !res.success) {
          console.warn('No se pudo persistir la asignación en el servidor, recargando...');
          await loadMapData();
        }
      }
    } catch (error) {
      console.error('Error asignando reporte:', error);
    }
  };

  const canUpdateStatus = (report: MapReport) => {
    return user?.role === 'AUTHORITY' || user?.role === 'ADMIN';
  };

  const canAssignReport = (report: MapReport) => {
    return user?.role === 'ADMIN';
  };

  const canViewSensitiveData = (report: MapReport) => {
    return user?.role === 'AUTHORITY' || user?.role === 'ADMIN';
  };

  const filteredReports = getFilteredReports();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #1F6FEB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6B7280' }}>Cargando mapa interactivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 4px rgba(31,41,55,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
              Mapa Interactivo
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              {user?.role === 'CITIZEN' ? 'Visualiza reportes públicos' :
               user?.role === 'AUTHORITY' ? 'Gestiona reportes de tu jurisdicción' :
               'Administra todos los reportes del sistema'}
            </p>
          </div>
        </div>

        {/* Los botones superiores fueron removidos por solicitud: tema, ubicación y crear reporte */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Se deja espacio para acciones futuras */}
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <label style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px',
              display: 'block'
            }}>
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="IN_PROGRESS">En Proceso</option>
              <option value="RESOLVED">Resueltos</option>
              <option value="REJECTED">Rechazados</option>
            </select>
              </div>
          
          <div>
            <label style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px',
              display: 'block'
            }}>
              Prioridad
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">Todas las prioridades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
              </div>

          {(user?.role === 'AUTHORITY' || user?.role === 'ADMIN') && (
            <div>
              <label style={{
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '4px',
                display: 'block'
              }}>
                Asignado
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value as any }))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="all">Todos</option>
                <option value="me">Asignados a mí</option>
                <option value="others">Asignados a otros</option>
                <option value="unassigned">Sin asignar</option>
              </select>
            </div>
          )}

          <div>
            <label style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px',
              display: 'block'
            }}>
              Proximidad
            </label>
            <select
              value={filters.proximity}
              onChange={(e) => setFilters(prev => ({ ...prev, proximity: e.target.value as any }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">Toda la ciudad</option>
              <option value="1km">1 km</option>
              <option value="5km">5 km</option>
              <option value="10km">10 km</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6B7280' }}>
              <input
                type="checkbox"
                checked={filters.showHeatmap}
                onChange={(e) => setFilters(prev => ({ ...prev, showHeatmap: e.target.checked }))}
                style={{ marginRight: '4px' }}
              />
              Heatmap
            </label>
            <label style={{ fontSize: '12px', color: '#6B7280' }}>
              <input
                type="checkbox"
                checked={filters.showCritical}
                onChange={(e) => setFilters(prev => ({ ...prev, showCritical: e.target.checked }))}
                style={{ marginRight: '4px' }}
              />
              Críticos
            </label>
          </div>
          
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              fontSize: '14px',
              color: '#6B7280'
            }}>
              {filteredReports.length} reportes mostrados
            </span>
          </div>
              </div>
              </div>

      {/* Mapa Interactivo */}
      <div style={{
        flex: '1',
        position: 'relative',
        backgroundColor: theme === 'light' ? '#E5E7EB' : '#1F2937',
        cursor: isCreatingReport ? 'crosshair' : 'default'
      }}>
        {/* Simulación del mapa con Leaflet */}
        <div 
          onClick={handleMapClick}
          style={{
            width: '100%',
            height: '100%',
            background: theme === 'light' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Heatmap (capa opcional) */}
          {filters.showHeatmap && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          )}

          {/* Clusters */}
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => handleClusterClick(cluster)}
              style={{
                position: 'absolute',
                left: `${((cluster.longitude + 99.2) / 0.1) * 100}%`,
                top: `${((19.5 - cluster.latitude) / 0.1) * 100}%`,
                width: cluster.count === 1 ? '20px' : `${Math.min(20 + cluster.count * 5, 50)}px`,
                height: cluster.count === 1 ? '20px' : `${Math.min(20 + cluster.count * 5, 50)}px`,
                backgroundColor: cluster.count === 1 
                  ? getStatusColor(cluster.reports[0].status)
                  : '#1F6FEB',
                borderRadius: '50%',
                border: '2px solid white',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: cluster.count === 1 ? 10 : 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: cluster.count === 1 ? '10px' : '12px',
                fontWeight: '600',
                animation: cluster.reports.some(r => r.isCritical) 
                  ? 'pulse 2s infinite' : 'none'
              }}
            >
              {cluster.count === 1 ? '' : cluster.count}
            </div>
          ))}

          {/* Marcadores individuales (fuera de clusters) */}
          {filteredReports.map((report) => {
            const isInCluster = clusters.some(cluster => 
              cluster.count > 1 && cluster.reports.some(r => r.id === report.id)
            );
            
            if (isInCluster) return null;

            return (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                style={{
                  position: 'absolute',
                  left: `${((report.longitude + 99.2) / 0.1) * 100}%`,
                  top: `${((19.5 - report.latitude) / 0.1) * 100}%`,
                  width: '20px',
                  height: '20px',
                  backgroundColor: getStatusColor(report.status),
                  borderRadius: '50%',
                  border: '2px solid white',
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: 10,
                  animation: report.isCritical ? 'pulse 2s infinite' : 'none'
                }}
                title={`${report.title} - ${getStatusDisplayName(report.status)}`}
              />
            );
          })}

          {/* Leyenda */}
          {showLegend && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: theme === 'light' ? 'white' : '#374151',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              color: theme === 'light' ? '#1F2937' : 'white'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Leyenda
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#F59E0B',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '12px' }}>Pendiente</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#1F6FEB',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '12px' }}>En Proceso</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#22C55E',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '12px' }}>Resuelto</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '12px' }}>Rechazado</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#1F6FEB',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ fontSize: '12px' }}>Crítico (&gt;48h)</span>
              </div>
              </div>
            </div>
          )}

          {/* Botón para ocultar/mostrar leyenda */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '8px 12px',
              backgroundColor: theme === 'light' ? 'white' : '#374151',
              color: theme === 'light' ? '#1F2937' : 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {showLegend ? 'Ocultar' : 'Mostrar'} Leyenda
          </button>
              </div>

        {/* Popup de reporte seleccionado */}
        {selectedReport && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            maxWidth: '450px',
            width: '90%',
            zIndex: 100,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {selectedReport.title}
              </h3>
              <button
                onClick={handleClosePopup}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
              </div>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getStatusColor(selectedReport.status),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getStatusDisplayName(selectedReport.status)}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getPriorityColor(selectedReport.priority),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getPriorityDisplayName(selectedReport.priority)}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {selectedReport.category}
              </span>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '12px',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <LocationIcon size={16} /> {selectedReport.address}
            </p>
            
            <p style={{
              fontSize: '12px',
              color: '#9CA3AF',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DocumentIcon size={14} /> {new Date(selectedReport.createdAt).toLocaleDateString()}
            </p>

            {/* Datos sensibles para autoridades */}
            {canViewSensitiveData(selectedReport) && selectedReport.citizenName && (
              <div style={{
                padding: '12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  <strong>Reportante:</strong> {selectedReport.citizenName}
                </p>
                {selectedReport.citizenPhone && (
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    <strong>Teléfono:</strong> {selectedReport.citizenPhone}
                  </p>
                )}
              </div>
            )}

            {/* Acciones rápidas para autoridades */}
            {(user?.role === 'AUTHORITY' || user?.role === 'ADMIN') && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {canUpdateStatus(selectedReport) && (
                  <select
                    value={selectedReport.status}
                    onChange={(e) => handleUpdateStatus(selectedReport.id, e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '11px',
                      outline: 'none'
                    }}
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="IN_PROGRESS">En Proceso</option>
                    <option value="RESOLVED">Resuelto</option>
                    <option value="REJECTED">Rechazado</option>
                  </select>
                )}
                
                {canAssignReport(selectedReport) && (
                  <select
                    value={selectedReport.assignedTo || ''}
                    onChange={(e) => handleAssignReport(selectedReport.id, e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '11px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Sin asignar</option>
                    <option value="Equipo Técnico">Equipo Técnico</option>
                    <option value="Equipo de Emergencias">Equipo de Emergencias</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                )}
              </div>
            )}
            
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => handleViewReport(selectedReport.id)}
                style={{
                  flex: '1',
                  padding: '8px 16px',
                  backgroundColor: '#1F6FEB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <EyeIcon size={14} /> Ver Detalle
              </button>
              <button
                onClick={handleClosePopup}
                style={{
                  flex: '1',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
        </div>
        )}

        {/* Estado vacío */}
        {filteredReports.length === 0 && !loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><MapIcon size={48} /></div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              No hay reportes que coincidan con los filtros
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280'
            }}>
              Intenta ajustar los filtros de búsqueda
            </p>
        </div>
        )}
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedMapPage; 
