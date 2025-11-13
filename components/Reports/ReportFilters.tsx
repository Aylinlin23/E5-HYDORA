import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';

const ReportFilters = ({ filters, onFilterChange, onReset }) => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    try {
      setLoading(true);
      const response = await userService.getAuthorities();
      if (response.success) {
        setAuthorities(response.data);
      }
    } catch (error) {
      console.error('Error loading authorities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleDateChange = (field, value) => {
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  return (
    <Card className="filters-card">
      <div className="filters-header">
        <Typography variant="h3" className="filters-title">
          Filtros Avanzados
        </Typography>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="reset-button"
        >
          Limpiar
        </Button>
      </div>

      <div className="filters-content">
        {/* BÃºsqueda general */}
        <div className="filter-group">
          <label className="filter-label">BÃºsqueda</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="ID, descripciÃ³n, ubicaciÃ³n..."
            className="hydora-input"
          />
        </div>

        {/* Estado */}
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="hydora-input"
          >
            <option value="">Todos los estados</option>
            <option value="sin_atender">Sin atender</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        {/* Prioridad */}
        <div className="filter-group">
          <label className="filter-label">Prioridad</label>
          <select
            value={filters.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="hydora-input"
          >
            <option value="">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Zona */}
        <div className="filter-group">
          <label className="filter-label">Zona/Colonia</label>
          <input
            type="text"
            value={filters.zone}
            onChange={(e) => handleInputChange('zone', e.target.value)}
            placeholder="Buscar por zona..."
            className="hydora-input"
          />
        </div>

        {/* Asignado */}
        <div className="filter-group">
          <label className="filter-label">Asignado a</label>
          <select
            value={filters.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            className="hydora-input"
            disabled={loading}
          >
            <option value="">Todos los responsables</option>
            <option value="unassigned">Sin asignar</option>
            {authorities.map(authority => (
              <option key={authority.id} value={authority.id}>
                {authority.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de fechas */}
        <div className="filter-group">
          <label className="filter-label">Rango de fechas</label>
          <div className="date-range">
            <div className="date-input">
              <label className="date-label">Desde</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="hydora-input"
              />
            </div>
            <div className="date-input">
              <label className="date-label">Hasta</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="hydora-input"
              />
            </div>
          </div>
        </div>

        {/* Filtros rÃ¡pidos */}
        <div className="filter-group">
          <label className="filter-label">Filtros rÃ¡pidos</label>
          <div className="quick-filters">
            <Button
              variant={filters.status === 'sin_atender' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleInputChange('status', filters.status === 'sin_atender' ? '' : 'sin_atender')}
            >
              Sin atender
            </Button>
            <Button
              variant={filters.priority === 'urgente' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleInputChange('priority', filters.priority === 'urgente' ? '' : 'urgente')}
            >
              Urgentes
            </Button>
            <Button
              variant={filters.assignedTo === 'unassigned' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleInputChange('assignedTo', filters.assignedTo === 'unassigned' ? '' : 'unassigned')}
            >
              Sin asignar
            </Button>
          </div>
        </div>
      </div>

      {/* EstadÃ­sticas de filtros */}
      <div className="filters-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">-</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sin atender:</span>
          <span className="stat-value">-</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Urgentes:</span>
          <span className="stat-value">-</span>
        </div>
      </div>
    </Card>
  );
};

export default ReportFilters; 
