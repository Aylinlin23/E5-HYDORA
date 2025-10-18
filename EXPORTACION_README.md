# Exportación de Datos - Hydora

## Resumen

Esta implementación proporciona funcionalidades completas de exportación de reportes para autoridades y administradores de Hydora, permitiendo generar reportes administrativos en formatos PDF y CSV.

## Características Implementadas

### 📊 Exportación PDF
- **Reportes individuales**: Detalle completo con historial
- **Listas de reportes**: Tabla con filtros aplicados
- **Información administrativa**: Metadatos del reporte
- **Formato profesional**: Diseño corporativo con logo

### 📈 Exportación CSV
- **Datos crudos**: Información completa para Excel
- **Filtros preservados**: Contexto de la exportación
- **Formato estándar**: Compatible con herramientas de análisis
- **Descarga automática**: Archivo listo para usar

### 🔐 Control de Acceso
- **Solo autoridades**: Restricción por rol
- **Verificación de permisos**: Middleware de seguridad
- **Auditoría**: Registro de exportaciones

## Componentes Principales

### Web (React)

#### `ExportReports.jsx`
```javascript
// Componente principal de exportación
<ExportReports 
  reports={reports}
  filters={filters}
  onExport={handleExport}
/>
```

**Características:**
- Selector de formato (PDF/CSV)
- Información del reporte
- Campos incluidos
- Estado de exportación

#### `PDFExport.jsx` (Actualizado)
```javascript
// Métodos de exportación PDF
PDFExport.exportReportsList(exportData);
PDFExport.exportHistorial(historialData);
PDFExport.exportReporteCompleto(reporteData);
```

**Características:**
- Exportación de listas completas
- Historial detallado
- Reportes individuales
- Formato profesional

### Móvil (React Native)

#### `ExportReportsMobile.js`
```javascript
// Componente móvil de exportación
<ExportReportsMobile 
  reports={reports}
  filters={filters}
  onExport={handleExport}
/>
```

**Características:**
- Modal de exportación
- Selector de formato
- Información del reporte
- Placeholder para funcionalidad futura

## Formatos de Exportación

### 1. PDF - Lista de Reportes
```javascript
const exportData = {
  title: 'Reporte de Incidencias - Hydora',
  subtitle: 'Generado el 15/01/2024 10:30',
  filters: 'Filtros aplicados: status=PENDING, priority=HIGH',
  data: [
    {
      ID: '1',
      Título: 'Fuga en calle principal',
      Estado: 'Pendiente',
      Prioridad: 'Alta',
      Ubicación: 'Calle Principal 123',
      Reportado_por: 'Juan Pérez',
      Fecha_creación: '15/01/2024 09:00'
    }
  ]
};
```

### 2. CSV - Datos Completos
```csv
ID,Título,Descripción,Estado,Prioridad,Ubicación,Coordenadas,Reportado_por,Email,Fecha_creación,Última_actualización,Fotos
1,Fuga en calle principal,Descripción detallada,Pendiente,Alta,Calle Principal 123,19.4326,-99.1332,Juan Pérez,juan@email.com,15/01/2024 09:00,15/01/2024 10:30,2
```

### 3. PDF - Reporte Individual
```javascript
const reporteData = {
  id: '1',
  titulo: 'Fuga en calle principal',
  estado: 'Pendiente',
  prioridad: 'Alta',
  ubicacion: 'Calle Principal 123',
  usuario: 'Juan Pérez',
  fechaCreacion: '15/01/2024 09:00',
  historial: [
    {
      fecha: '15/01/2024 09:00',
      usuario: 'Juan Pérez',
      estadoPrevio: '',
      estadoNuevo: 'Pendiente',
      comentario: 'Reporte inicial'
    }
  ]
};
```

## Campos Incluidos

### Información Básica
- **ID**: Identificador único del reporte
- **Título**: Título del reporte
- **Descripción**: Descripción detallada
- **Estado**: Estado actual (Pendiente, En Progreso, Resuelto, Rechazado)
- **Prioridad**: Nivel de prioridad (Baja, Media, Alta, Urgente)

### Información Geográfica
- **Ubicación**: Dirección del reporte
- **Coordenadas**: Latitud y longitud
- **Zona**: Área geográfica (si aplica)

### Información de Usuario
- **Reportado por**: Nombre del usuario que creó el reporte
- **Email**: Correo electrónico del usuario
- **Teléfono**: Número de contacto (si disponible)

### Información Temporal
- **Fecha de creación**: Cuándo se creó el reporte
- **Última actualización**: Última modificación
- **Tiempo de resolución**: Días para resolver (si aplica)

### Información Adicional
- **Número de fotos**: Cantidad de imágenes adjuntas
- **Comentarios**: Comentarios adicionales
- **Asignado a**: Autoridad responsable (si aplica)

## API Backend

### Endpoint: `GET /api/reports` (con filtros)
```javascript
// Ejemplo de filtros para exportación
const filters = {
  status: 'PENDING',
  priority: 'HIGH',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  search: 'fuga'
};

const response = await reportService.getAll(filters);
```

## Funcionalidades

### 1. Exportación Inteligente
- **Filtros preservados**: Contexto de la exportación
- **Metadatos incluidos**: Información del reporte
- **Formato adaptativo**: PDF para presentación, CSV para análisis

### 2. Control de Calidad
- **Validación de datos**: Verificación de campos requeridos
- **Manejo de errores**: Recuperación graceful
- **Feedback al usuario**: Estado de exportación

### 3. Seguridad
- **Verificación de permisos**: Solo autoridades y admins
- **Auditoría**: Registro de exportaciones
- **Sanitización**: Limpieza de datos sensibles

### 4. UX/UI
- **Interfaz intuitiva**: Botones claros y accesibles
- **Estados visuales**: Loading, éxito, error
- **Información contextual**: Ayuda y tooltips

## Configuración

### Dependencias Requeridas

#### Web
```json
{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.1",
  "papaparse": "^5.4.1"
}
```

#### Móvil
```json
{
  "react-native-fs": "^2.20.0"
}
```

## Uso

### 1. Exportar Lista de Reportes
```javascript
// Desde el panel de autoridad
const handleExport = (type) => {
  if (type === 'pdf') {
    // Exportar PDF
    PDFExport.exportReportsList(exportData);
  } else if (type === 'csv') {
    // Exportar CSV
    const csv = Papa.unparse(data);
    downloadCSV(csv, 'reportes.csv');
  }
};
```

### 2. Exportar Reporte Individual
```javascript
// Desde el detalle del reporte
const handleExportReport = () => {
  const reporteData = {
    id: report.id,
    titulo: report.title,
    estado: getStatusDisplayName(report.status),
    // ... más campos
  };
  
  PDFExport.exportReporteCompleto(reporteData);
};
```

### 3. Exportar Historial
```javascript
// Desde el historial de cambios
const handleExportHistorial = () => {
  const historialData = {
    title: `Historial - ${report.title}`,
    subtitle: `Reporte ID: ${report.id}`,
    data: parseHistorial(report.statusHistory)
  };
  
  PDFExport.exportHistorial(historialData);
};
```

## Estados y Flujos

### Flujo de Exportación
1. **Usuario** selecciona reportes y formato
2. **Frontend** valida permisos y datos
3. **Backend** procesa filtros y datos
4. **Frontend** genera archivo (PDF/CSV)
5. **Usuario** descarga archivo

### Estados del Componente
- **Idle**: Listo para exportar
- **Loading**: Generando archivo
- **Success**: Archivo generado exitosamente
- **Error**: Error en la exportación

## Características Técnicas

### Performance
- **Generación asíncrona**: No bloquea la UI
- **Compresión de datos**: Archivos optimizados
- **Cache inteligente**: Datos reutilizados

### Compatibilidad
- **PDF**: Compatible con todos los lectores
- **CSV**: Compatible con Excel, Google Sheets, etc.
- **Encoding**: UTF-8 para caracteres especiales

### Responsive
- **Web**: Exportación completa con controles
- **Móvil**: Modal optimizado para touch
- **Tablet**: Layout híbrido

## Mejoras Futuras

### Funcionalidades Adicionales
- [ ] Exportación programada
- [ ] Plantillas personalizables
- [ ] Compresión de archivos
- [ ] Envío por email

### Optimizaciones
- [ ] Generación en background
- [ ] Cache de archivos
- [ ] Streaming para archivos grandes
- [ ] Compresión progresiva

### UX/UI
- [ ] Preview de exportación
- [ ] Drag & drop de archivos
- [ ] Historial de exportaciones
- [ ] Notificaciones push

## Troubleshooting

### Problemas Comunes

1. **Error de permisos**
   - Verificar rol de usuario
   - Comprobar token JWT
   - Revisar middleware de autorización

2. **Archivo corrupto**
   - Verificar encoding UTF-8
   - Comprobar caracteres especiales
   - Revisar formato de datos

3. **Exportación lenta**
   - Reducir cantidad de datos
   - Optimizar consultas
   - Implementar paginación

### Debug

```javascript
// Habilitar logs detallados
const DEBUG_EXPORT = true;

if (DEBUG_EXPORT) {
  console.log('Export data:', exportData);
  console.log('User permissions:', user.role);
  console.log('Filters applied:', filters);
}
```

## Contribución

Para agregar nuevos formatos de exportación:

1. Crear método en `PDFExport.jsx`
2. Agregar opción en `ExportReports.jsx`
3. Actualizar documentación
4. Probar en ambas plataformas

## Licencia

Este código es parte del proyecto Hydora y sigue las mismas políticas de licencia del proyecto principal.

## Ejemplos de Uso

### Exportación Completa
```javascript
const ExportExample = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({});
  
  const handleExport = (type) => {
    const exportData = {
      reports,
      filters,
      user: currentUser,
      timestamp: new Date()
    };
    
    if (type === 'pdf') {
      PDFExport.exportReportsList(exportData);
    } else {
      exportToCSV(exportData);
    }
  };
  
  return (
    <ExportReports
      reports={reports}
      filters={filters}
      onExport={handleExport}
    />
  );
};
```

### Exportación Personalizada
```javascript
const CustomExport = ({ data, format }) => {
  const exportCustomData = () => {
    const customData = {
      title: 'Reporte Personalizado',
      subtitle: `Generado el ${new Date().toLocaleDateString()}`,
      data: data.map(item => ({
        // Campos personalizados
        Campo1: item.field1,
        Campo2: item.field2,
        // ...
      }))
    };
    
    if (format === 'pdf') {
      PDFExport.exportReportsList(customData);
    } else {
      exportToCSV(customData.data);
    }
  };
  
  return (
    <button onClick={exportCustomData}>
      Exportar {format.toUpperCase()}
    </button>
  );
};
``` 