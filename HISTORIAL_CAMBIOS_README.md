# Historial Detallado de Cambios - Hydora

## Resumen

Esta implementación proporciona un sistema completo de trazabilidad para los cambios de estado de los reportes en Hydora, permitiendo ver quién cambió el estado, cuándo y por qué.

## Características Implementadas

### 📋 Historial Visual
- **Línea de tiempo**: Visualización cronológica de cambios
- **Iconos de estado**: Indicadores visuales por tipo de cambio
- **Información detallada**: Usuario, fecha, comentarios
- **Estados vacíos**: Manejo elegante cuando no hay historial

### 📄 Exportación PDF
- **PDF para autoridades**: Descarga del historial completo
- **Formato estructurado**: Tabla con todos los cambios
- **Información completa**: Usuario, fechas, estados, comentarios

### 🔄 Persistencia
- **JSON en base de datos**: Historial almacenado como string JSON
- **Parsing inteligente**: Manejo de errores de parsing
- **Compatibilidad**: Funciona con datos existentes

## Componentes Principales

### Web (React)

#### `HistorialCambios.jsx`
```javascript
// Componente principal del historial
<HistorialCambios 
  historial={report.statusHistory}
  reporteId={report.id}
  reporteTitulo={report.title}
/>
```

**Características:**
- Timeline visual con iconos
- Mostrar/ocultar historial completo
- Botón de descarga PDF para autoridades
- Estados vacíos informativos

### Móvil (React Native)

#### `HistorialCambiosMobile.js`
```javascript
// Componente móvil del historial
<HistorialCambiosMobile 
  historial={report.statusHistory}
  reporteId={report.id}
  reporteTitulo={report.title}
/>
```

**Características:**
- Diseño adaptado para móvil
- Scroll optimizado
- Iconos emoji para estados
- Modal para historial completo

## Estructura de Datos

### Formato del Historial
```json
[
  {
    "estadoPrevio": "PENDING",
    "estadoNuevo": "IN_PROGRESS",
    "usuario": "María González",
    "fecha": "2024-01-15T10:30:00.000Z",
    "comentario": "Iniciando investigación del reporte"
  },
  {
    "estadoPrevio": "IN_PROGRESS",
    "estadoNuevo": "RESOLVED",
    "usuario": "María González",
    "fecha": "2024-01-16T14:45:00.000Z",
    "comentario": "Fuga reparada exitosamente"
  }
]
```

### Estados Soportados
- **PENDING**: Pendiente (⏰)
- **IN_PROGRESS**: En Progreso (⚡)
- **RESOLVED**: Resuelto (✅)
- **REJECTED**: Rechazado (❌)

## API Backend

### Endpoint: `PATCH /api/reports/:id/status`

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "comentario": "Iniciando investigación del reporte"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Estado actualizado exitosamente",
  "report": {
    "id": "report_id",
    "status": "IN_PROGRESS",
    "statusHistory": "[{...}]",
    "user": {...}
  }
}
```

## Funcionalidades

### 1. Visualización del Historial

#### Web
- Timeline con iconos SVG
- Colores por estado
- Información de tiempo relativo
- Comentarios en cursiva

#### Móvil
- Iconos emoji
- Diseño compacto
- Scroll optimizado
- Modal para vista completa

### 2. Exportación PDF

#### Métodos Disponibles
```javascript
// Exportar solo historial
PDFExport.exportHistorial(historialData);

// Exportar reporte completo con historial
PDFExport.exportReporteCompleto(reporteData);
```

#### Formato PDF
- Tabla estructurada
- Encabezados con colores
- Información completa
- Diseño profesional

### 3. Parsing Inteligente

```javascript
const parseHistorial = (historial) => {
  if (typeof historial === 'string') {
    try {
      return JSON.parse(historial);
    } catch (error) {
      console.error('Error parsing historial:', error);
      return [];
    }
  }
  return historial || [];
};
```

## Implementación en Páginas

### ReportDetailPage.jsx (Web)
- Integración del componente HistorialCambios
- Layout responsive
- Acciones contextuales

### ReportDetailScreen.js (Móvil)
- Integración del componente HistorialCambiosMobile
- Diseño nativo
- Navegación optimizada

## Características Técnicas

### Performance
- **Parsing lazy**: Solo cuando se necesita
- **Renderizado condicional**: Mostrar/ocultar según necesidad
- **Cache de datos**: Evitar re-parsing

### UX/UI
- **Feedback visual**: Iconos y colores
- **Estados vacíos**: Mensajes informativos
- **Accesibilidad**: Navegación por teclado

### Responsive
- **Web**: Timeline completo con controles
- **Móvil**: Vista compacta con modal
- **Tablet**: Layout híbrido

## Configuración

### Dependencias Requeridas

#### Web
```json
{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.1"
}
```

#### Móvil
```json
{
  "react-native-pdf": "^6.7.1"
}
```

## Uso

### 1. Mostrar Historial
```javascript
// En cualquier componente
<HistorialCambios 
  historial={report.statusHistory}
  reporteId={report.id}
  reporteTitulo={report.title}
/>
```

### 2. Actualizar Estado
```javascript
// Desde el backend
const response = await reportService.updateStatus(reportId, {
  status: 'IN_PROGRESS',
  comentario: 'Iniciando investigación'
});
```

### 3. Exportar PDF
```javascript
// Solo para autoridades
if (user.role === 'AUTHORITY') {
  PDFExport.exportHistorial(historialData);
}
```

## Estados y Flujos

### Flujo de Cambio de Estado
1. **Autoridad** selecciona nuevo estado
2. **Sistema** valida el cambio
3. **Backend** actualiza estado e historial
4. **Frontend** muestra cambio en tiempo real
5. **Notificación** se envía al usuario

### Estados del Componente
- **Loading**: Cargando historial
- **Empty**: Sin historial disponible
- **Partial**: Mostrando últimos 3 cambios
- **Full**: Mostrando historial completo

## Mejoras Futuras

### Funcionalidades Adicionales
- [ ] Filtros por tipo de cambio
- [ ] Búsqueda en comentarios
- [ ] Notificaciones push de cambios
- [ ] Historial de ediciones de reporte

### Optimizaciones
- [ ] Virtualización para historiales largos
- [ ] Cache más sofisticado
- [ ] Compresión de datos
- [ ] Sincronización en tiempo real

### UX/UI
- [ ] Animaciones de transición
- [ ] Modo oscuro mejorado
- [ ] Gestos táctiles
- [ ] Voz y accesibilidad

## Troubleshooting

### Problemas Comunes

1. **Historial no se muestra**
   - Verificar que `statusHistory` existe
   - Revisar formato JSON
   - Comprobar permisos de usuario

2. **PDF no se descarga**
   - Verificar rol de autoridad
   - Revisar dependencias jsPDF
   - Comprobar permisos de archivo

3. **Parsing errors**
   - Verificar formato JSON
   - Revisar encoding de caracteres
   - Comprobar datos de entrada

### Debug

```javascript
// Habilitar logs detallados
const DEBUG = true;

if (DEBUG) {
  console.log('Historial raw:', historial);
  console.log('Historial parsed:', parseHistorial(historial));
  console.log('User role:', user.role);
}
```

## Contribución

Para agregar nuevos tipos de cambios:

1. Actualizar el backend en `reportController.js`
2. Agregar iconos/colores en el componente
3. Actualizar la documentación
4. Probar en ambas plataformas

## Licencia

Este código es parte del proyecto Hydora y sigue las mismas políticas de licencia del proyecto principal.

## Ejemplos de Uso

### Historial Completo
```javascript
const historialCompleto = [
  {
    estadoPrevio: "PENDING",
    estadoNuevo: "IN_PROGRESS",
    usuario: "María González",
    fecha: "2024-01-15T10:30:00.000Z",
    comentario: "Iniciando investigación del reporte"
  },
  {
    estadoPrevio: "IN_PROGRESS",
    estadoNuevo: "RESOLVED",
    usuario: "María González",
    fecha: "2024-01-16T14:45:00.000Z",
    comentario: "Fuga reparada exitosamente"
  }
];
```

### Exportación PDF
```javascript
const pdfData = {
  title: "Historial de Cambios - Fuga en calle principal",
  subtitle: "Reporte ID: clx123456",
  data: historialCompleto.map(item => ({
    fecha: formatDate(item.fecha),
    usuario: item.usuario,
    estadoPrevio: getStatusDisplayName(item.estadoPrevio),
    estadoNuevo: getStatusDisplayName(item.estadoNuevo),
    comentario: item.comentario
  }))
};

PDFExport.exportHistorial(pdfData);
``` 