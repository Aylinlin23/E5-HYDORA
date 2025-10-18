# Filtros Avanzados y Paginación - Hydora

## Resumen

Esta implementación proporciona un sistema completo de filtros avanzados y paginación para la gestión de reportes en Hydora, tanto para la versión web como móvil.

## Características Implementadas

### 🔍 Filtros Avanzados
- **Filtro por Estado**: PENDING, IN_PROGRESS, RESOLVED, REJECTED
- **Filtro por Prioridad**: LOW, MEDIUM, HIGH, URGENT
- **Búsqueda de Texto**: En título y descripción de reportes
- **Filtro por Fecha**: Rango de fechas de creación
- **Filtro Geográfico**: Radio desde un punto específico (lat/lng)

### 📄 Paginación
- **Paginación Tradicional**: Navegación por páginas con controles
- **Infinite Scroll**: Carga automática al llegar al final
- **Información de Paginación**: Total de elementos, páginas, etc.

### 🎯 Persistencia
- **URL Parameters**: Los filtros se mantienen en la URL
- **Local Storage**: Cache de resultados recientes
- **Estado Global**: Filtros persistentes entre navegaciones

## Componentes Principales

### Web (React)

#### `AdvancedFilters.jsx`
```javascript
// Componente principal de filtros
<AdvancedFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
  onReset={handleResetFilters}
  showGeographic={true}
  showSearch={true}
/>
```

#### `Pagination.jsx`
```javascript
// Componente de paginación
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  totalItems={pagination.totalItems}
  itemsPerPage={pagination.itemsPerPage}
  onPageChange={handlePageChange}
  showInfo={true}
/>
```

#### `InfiniteScroll.jsx`
```javascript
// Componente de infinite scroll
<InfiniteScroll
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
>
  {/* Contenido */}
</InfiniteScroll>
```

### Móvil (React Native)

#### `AdvancedFiltersMobile.js`
```javascript
// Componente de filtros móviles
<AdvancedFiltersMobile
  filters={filters}
  onFiltersChange={handleFiltersChange}
  onReset={handleResetFilters}
  showGeographic={false}
  showSearch={true}
/>
```

## Hooks Personalizados

### `useFilters.js`
Maneja la persistencia de filtros en URL y localStorage:

```javascript
const { filters, updateFilters, resetFilters } = useFilters({
  status: 'all',
  priority: 'all',
  dateFrom: '',
  dateTo: '',
  search: '',
  lat: '',
  lng: '',
  radius: ''
});
```

### `useInfiniteScroll.js`
Maneja la lógica de infinite scroll:

```javascript
const {
  reports,
  loading,
  hasMore,
  error,
  loadMore,
  refresh,
  updateFilters
} = useInfiniteScroll(initialFilters);
```

## API Backend

### Endpoint: `GET /api/reports`

**Parámetros de Query:**
- `status`: Estado del reporte
- `priority`: Prioridad del reporte
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `dateFrom`: Fecha de inicio (YYYY-MM-DD)
- `dateTo`: Fecha de fin (YYYY-MM-DD)
- `search`: Búsqueda en título y descripción
- `lat`: Latitud del centro geográfico
- `lng`: Longitud del centro geográfico
- `radius`: Radio en kilómetros

**Ejemplo de Request:**
```
GET /api/reports?status=PENDING&priority=HIGH&page=1&limit=20&dateFrom=2024-01-01&search=fuga
```

**Respuesta:**
```json
{
  "success": true,
  "reports": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

## Implementación en Páginas

### AuthorityPanelPage.jsx
- Filtros avanzados completos
- Paginación tradicional
- Estadísticas en tiempo real
- Gestión de estados de reportes

### MyReportsPage.jsx
- Filtros adaptados para ciudadanos
- Paginación con cache
- Estadísticas personales

### AuthorityPanelPageInfinite.jsx
- Versión alternativa con infinite scroll
- Carga automática de más reportes
- Mejor experiencia en móvil

## Características Técnicas

### Performance
- **Cache Inteligente**: Resultados cacheados por filtros
- **Debounce**: Búsqueda optimizada
- **Lazy Loading**: Carga progresiva de datos

### UX/UI
- **Feedback Visual**: Indicadores de carga
- **Estados Vacíos**: Mensajes informativos
- **Accesibilidad**: Navegación por teclado

### Responsive
- **Web**: Diseño adaptativo con Tailwind CSS
- **Móvil**: Componentes nativos optimizados
- **Tablet**: Layout híbrido

## Configuración

### Variables de Entorno
```env
# Web
VITE_API_BASE_URL=http://localhost:3000/api

# Móvil
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Dependencias Requeridas

#### Web
```json
{
  "axios": "^1.6.0",
  "react-router-dom": "^6.8.0",
  "tailwindcss": "^3.3.0"
}
```

#### Móvil
```json
{
  "axios": "^1.6.0",
  "@react-navigation/native": "^6.1.0",
  "@react-native-picker/picker": "^2.4.0",
  "@react-native-community/datetimepicker": "^7.6.0"
}
```

## Uso

### 1. Configurar Filtros
```javascript
const [filters, setFilters] = useState({
  status: 'all',
  priority: 'all',
  dateFrom: '',
  dateTo: '',
  search: '',
  lat: '',
  lng: '',
  radius: ''
});
```

### 2. Implementar Paginación
```javascript
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
});
```

### 3. Manejar Cambios
```javascript
const handleFiltersChange = (newFilters) => {
  setFilters(newFilters);
  setPagination(prev => ({ ...prev, currentPage: 1 }));
};

const handlePageChange = (newPage) => {
  setPagination(prev => ({ ...prev, currentPage: newPage }));
};
```

## Mejoras Futuras

### Funcionalidades Adicionales
- [ ] Filtros guardados/favoritos
- [ ] Exportación de resultados filtrados
- [ ] Filtros por autoridad asignada
- [ ] Búsqueda avanzada con operadores

### Optimizaciones
- [ ] Virtualización de listas largas
- [ ] Cache más sofisticado
- [ ] Compresión de datos
- [ ] Prefetching inteligente

### UX/UI
- [ ] Animaciones de transición
- [ ] Modo oscuro mejorado
- [ ] Gestos táctiles
- [ ] Voz y accesibilidad

## Troubleshooting

### Problemas Comunes

1. **Filtros no se aplican**
   - Verificar que el backend recibe los parámetros
   - Revisar la sintaxis de los filtros

2. **Paginación no funciona**
   - Verificar que `totalPages` se calcula correctamente
   - Revisar el manejo de `currentPage`

3. **Infinite scroll no carga**
   - Verificar que `hasMore` se actualiza correctamente
   - Revisar el threshold del IntersectionObserver

### Debug

```javascript
// Habilitar logs detallados
const DEBUG = true;

if (DEBUG) {
  console.log('Filtros:', filters);
  console.log('Paginación:', pagination);
  console.log('Respuesta API:', response);
}
```

## Contribución

Para agregar nuevos filtros:

1. Actualizar el backend en `reportController.js`
2. Agregar el campo en el componente de filtros
3. Actualizar el hook `useFilters`
4. Probar en ambas plataformas (web/móvil)

## Licencia

Este código es parte del proyecto Hydora y sigue las mismas políticas de licencia del proyecto principal. 