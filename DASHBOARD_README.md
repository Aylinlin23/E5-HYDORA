# Dashboard Visual - Hydora

## Resumen

Esta implementación proporciona un dashboard visual completo para administradores y autoridades de Hydora, con métricas atractivas y gráficos interactivos para monitorear el estado del sistema.

## Características Implementadas

### 📊 Métricas Visuales
- **Gráfico de pastel**: Distribución de reportes por estado
- **Gráfico de barras**: Reportes por mes y prioridad
- **Gráfico de línea**: Tendencia de reportes en el tiempo
- **Métricas rápidas**: Total de reportes, pendientes, resueltos, usuarios

### 🎯 Métricas de Eficiencia
- **Tasa de resolución**: Porcentaje de reportes resueltos
- **Tiempo promedio de resolución**: Días promedio para resolver
- **Tiempo de respuesta**: Horas promedio para primer cambio de estado

### 📍 Análisis Geográfico
- **Top zonas**: Áreas con más incidencias
- **Mapa de calor**: Visualización de densidad de reportes

## Componentes Principales

### Web (React)

#### `DashboardPage.jsx`
```javascript
// Componente principal del dashboard
<DashboardPage />
```

**Características:**
- Gráficos interactivos con Recharts
- Métricas en tiempo real
- Diseño responsive
- Exportación de datos

### Móvil (React Native)

#### `DashboardScreen.js`
```javascript
// Componente móvil del dashboard
<DashboardScreen />
```

**Características:**
- Métricas adaptadas para móvil
- Barras de progreso visuales
- Navegación optimizada
- Acciones rápidas

## Gráficos Implementados

### 1. Gráfico de Pastel - Estados
```javascript
<PieChart>
  <Pie
    data={getStatusPieData()}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
    {getStatusPieData().map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

### 2. Gráfico de Barras - Por Mes
```javascript
<BarChart data={getMonthlyBarData()}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="reportes" fill="#3b82f6" />
</BarChart>
```

### 3. Gráfico de Línea - Tendencia
```javascript
<LineChart data={getTrendData()}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="reportes" stroke="#3b82f6" strokeWidth={2} />
</LineChart>
```

## API Backend

### Endpoint: `GET /api/reports/stats/dashboard`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalReports": 150,
    "totalUsers": 45,
    "reportsByStatus": {
      "PENDING": 30,
      "IN_PROGRESS": 25,
      "RESOLVED": 85,
      "REJECTED": 10
    },
    "reportsByPriority": {
      "LOW": 20,
      "MEDIUM": 60,
      "HIGH": 50,
      "URGENT": 20
    },
    "reportsByMonth": {
      "2024-01": 25,
      "2024-02": 30,
      "2024-03": 35
    },
    "topZones": [
      {
        "address": "Calle Principal 123",
        "count": 15
      }
    ],
    "averageResolutionTime": 3.5,
    "resolutionRate": 0.567,
    "averageResponseTime": 2.3
  }
}
```

## Funcionalidades

### 1. Métricas Rápidas
- **Total de reportes**: Número total en el sistema
- **Pendientes**: Reportes sin atender
- **Resueltos**: Reportes completados
- **Usuarios activos**: Total de usuarios registrados

### 2. Análisis por Estado
- **Pendientes**: Amarillo (#fbbf24)
- **En Progreso**: Azul (#3b82f6)
- **Resueltos**: Verde (#10b981)
- **Rechazados**: Rojo (#ef4444)

### 3. Análisis por Prioridad
- **Baja**: Verde (#10b981)
- **Media**: Amarillo (#fbbf24)
- **Alta**: Naranja (#f97316)
- **Urgente**: Rojo (#ef4444)

### 4. Métricas de Eficiencia
- **Tasa de resolución**: Porcentaje de reportes resueltos
- **Tiempo promedio**: Días para resolver un reporte
- **Tiempo de respuesta**: Horas para primer cambio de estado

## Configuración

### Dependencias Requeridas

#### Web
```json
{
  "recharts": "^2.8.0"
}
```

#### Móvil
```json
{
  "react-native-svg": "^14.0.0"
}
```

## Uso

### 1. Acceder al Dashboard
```javascript
// Web
navigate('/dashboard');

// Móvil
navigation.navigate('Dashboard');
```

### 2. Obtener Estadísticas
```javascript
// Desde el servicio API
const response = await reportService.getDashboardStats();
if (response.success) {
  setStats(response.stats);
}
```

### 3. Renderizar Gráficos
```javascript
// Datos para gráfico de pastel
const getStatusPieData = () => {
  return Object.entries(stats.reportsByStatus).map(([status, count]) => ({
    name: getStatusDisplayName(status),
    value: count,
    color: getStatusColor(status)
  }));
};
```

## Estados y Flujos

### Flujo de Datos
1. **Usuario** accede al dashboard
2. **Frontend** solicita estadísticas
3. **Backend** calcula métricas en tiempo real
4. **Frontend** renderiza gráficos y métricas
5. **Usuario** visualiza información actualizada

### Estados del Componente
- **Loading**: Cargando estadísticas
- **Error**: Error al obtener datos
- **Success**: Datos cargados correctamente
- **Empty**: Sin datos disponibles

## Características Técnicas

### Performance
- **Cálculos optimizados**: Métricas calculadas en backend
- **Cache inteligente**: Datos cacheados por 5 minutos
- **Lazy loading**: Gráficos cargados bajo demanda

### UX/UI
- **Diseño responsive**: Adaptado a diferentes pantallas
- **Colores consistentes**: Paleta unificada
- **Interactividad**: Tooltips y hover effects

### Responsive
- **Web**: Gráficos completos con controles
- **Móvil**: Métricas simplificadas con barras
- **Tablet**: Layout híbrido optimizado

## Mejoras Futuras

### Funcionalidades Adicionales
- [ ] Filtros de fecha en gráficos
- [ ] Exportación de métricas a PDF
- [ ] Notificaciones de alertas
- [ ] Comparación de períodos

### Optimizaciones
- [ ] Gráficos en tiempo real
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

1. **Gráficos no se renderizan**
   - Verificar que Recharts esté instalado
   - Comprobar formato de datos
   - Revisar permisos de usuario

2. **Métricas no se actualizan**
   - Verificar conexión al backend
   - Revisar cache del navegador
   - Comprobar permisos de autoridad

3. **Errores de datos**
   - Verificar formato JSON
   - Revisar cálculos en backend
   - Comprobar datos de entrada

### Debug

```javascript
// Habilitar logs detallados
const DEBUG = true;

if (DEBUG) {
  console.log('Stats raw:', stats);
  console.log('Pie data:', getStatusPieData());
  console.log('User role:', user.role);
}
```

## Contribución

Para agregar nuevas métricas:

1. Actualizar el backend en `reportController.js`
2. Agregar gráfico en el componente
3. Actualizar la documentación
4. Probar en ambas plataformas

## Licencia

Este código es parte del proyecto Hydora y sigue las mismas políticas de licencia del proyecto principal.

## Ejemplos de Uso

### Dashboard Completo
```javascript
const DashboardExample = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    const response = await reportService.getDashboardStats();
    if (response.success) {
      setStats(response.stats);
    }
  };
  
  return (
    <div className="dashboard">
      <MetricsCards stats={stats} />
      <ChartsSection stats={stats} />
      <EfficiencyMetrics stats={stats} />
    </div>
  );
};
```

### Gráfico Personalizado
```javascript
const CustomChart = ({ data, title }) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
``` 