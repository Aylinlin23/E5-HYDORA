import { useState, useEffect } from 'react';
import { useTheme } from '../store/ThemeContext';

const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  showGeographic = false,
  showSearch = true,
  className = '' 
}) => {
  const { isDarkMode } = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters: React.FC = () => {
    onFiltersChange(localFilters);
  };

  const handleReset: React.FC = () => {
    const resetFilters = {
      status: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      search: '',
      lat: '',
      lng: '',
      radius: ''
    };
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  const getStatusOptions = () => [
    { value: 'all', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'RESOLVED', label: 'Resueltos' },
    { value: 'REJECTED', label: 'Rechazados' }
  ];

  const getPriorityOptions = () => [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${className}`}>
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Filtros Avanzados
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'} filtros
          </button>
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Filtros bÃ¡sicos siempre visibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={localFilters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            {getStatusOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridad
          </label>
          <select
            value={localFilters.priority || 'all'}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            {getPriorityOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* BÃºsqueda */}
        {showSearch && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="TÃ­tulo, descripciÃ³n, direcciÃ³n..."
              className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filtros geogrÃ¡ficos (opcional) */}
            {showGeographic && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={localFilters.lat || ''}
                    onChange={(e) => handleDateChange('lat', e.target.value)}
                    placeholder="0.000000"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={localFilters.lng || ''}
                    onChange={(e) => handleDateChange('lng', e.target.value)}
                    placeholder="0.000000"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Radio (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={localFilters.radius || ''}
                    onChange={(e) => handleDateChange('radius', e.target.value)}
                    placeholder="5"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          {/* BotÃ³n aplicar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {Object.values(localFilters).some(value => value && value !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Filtros activos:</span>
            {localFilters.status && localFilters.status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Estado: {getStatusOptions().find(opt => opt.value === localFilters.status)?.label}
              </span>
            )}
            {localFilters.priority && localFilters.priority !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Prioridad: {getPriorityOptions().find(opt => opt.value === localFilters.priority)?.label}
              </span>
            )}
            {localFilters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                BÃºsqueda: "{localFilters.search}"
              </span>
            )}
            {(localFilters.dateFrom || localFilters.dateTo) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Fecha: {localFilters.dateFrom || 'Inicio'} - {localFilters.dateTo || 'Fin'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 
