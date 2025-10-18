# Hydora Frontend

Plataforma web para reportar y gestionar problemas en la ciudad con roles diferenciados para ciudadanos y autoridades.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL del backend

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 👥 Roles de Usuario

### Ciudadano
- **Email:** ciudadano@test.com
- **Password:** password123
- **Funciones:**
  - Crear reportes de problemas
  - Ver estado de reportes propios
  - Explorar mapa de reportes
  - Recibir notificaciones

### Autoridad
- **Email:** autoridad@test.com  
- **Password:** password123
- **Funciones:**
  - Gestionar reportes asignados
  - Filtrar y buscar reportes
  - Cambiar estados de reportes
  - Ver dashboard con métricas
  - Exportar datos

### Administrador
- **Email:** admin@test.com
- **Password:** password123
- **Funciones:**
  - Todas las funciones de autoridad
  - Gestión de usuarios
  - Configuración del sistema

## 🎯 Flujo de Demo

### 1. Crear Reporte (Ciudadano)
1. Inicia sesión como ciudadano
2. Ve a "Crear Reporte"
3. Completa el formulario con:
   - Ubicación (selecciona en el mapa)
   - Descripción del problema
   - Categoría
   - Fotos (opcional)
4. Envía el reporte

### 2. Gestionar Reporte (Autoridad)
1. Cierra sesión e inicia como autoridad
2. Ve a "Gestión de Reportes"
3. Encuentra el reporte creado
4. Asigna el reporte a una autoridad
5. Cambia el estado a "En Proceso"
6. Agrega comentarios

### 3. Probar Notificaciones
1. Ve a "Prueba Notificaciones"
2. Prueba diferentes tipos de alertas
3. Verifica comentarios en tiempo real
4. Prueba el sistema de notificaciones push

### 4. Explorar Dashboard
1. Ve al "Dashboard"
2. Revisa métricas y gráficos
3. Prueba la exportación de datos
4. Explora el mapa de zonas críticas

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **React Router** - Navegación
- **Context API** - Estado global
- **Leaflet** - Mapas interactivos
- **Recharts** - Gráficos y métricas
- **CSS Variables** - Sistema de diseño
- **Intersection Observer** - Lazy loading

## 🎨 Sistema de Diseño

### Colores
- **Primario:** #1F6FEB (Azul)
- **Secundario:** #22C55E (Verde)
- **Error:** #EF4444 (Rojo)
- **Advertencia:** #F59E0B (Amarillo)

### Tipografía
- **Familia:** Inter
- **Escalas:** H1 (32px), H2 (24px), H3 (20px), Body (16px)

### Espaciado
- **Base:** 8px
- **Escalas:** 8px, 16px, 24px, 32px, 48px

## 📱 Características

### Responsive Design
- Adaptación automática a móviles
- Sidebar colapsable en pantallas pequeñas
- Mapas full screen en dispositivos móviles

### Dark Mode
- Toggle automático en navegación
- Detección de preferencia del sistema
- Persistencia en localStorage

### Accesibilidad
- Navegación por teclado
- ARIA labels y roles
- High contrast mode
- Reduced motion support

### Performance
- Lazy loading de componentes
- Debounce en búsquedas
- Memoización con React hooks
- Intersection Observer para carga

## 🔍 Búsqueda Global

La búsqueda global permite encontrar:
- **Reportes** por ID o descripción
- **Ubicaciones** por nombre de zona
- **Usuarios** por nombre o rol

**Atajos de teclado:**
- `↑/↓` - Navegar resultados
- `Enter` - Seleccionar resultado
- `Escape` - Cerrar búsqueda

## 🗺️ Mapas Interactivos

### Funcionalidades
- **Clustering** de reportes cercanos
- **Heatmap** de densidad de problemas
- **Marcadores** diferenciados por estado
- **Filtros** en tiempo real
- **"Reportar aquí"** con ubicación automática

### Estados de Marcadores
- 🔴 **Rojo:** Sin atender
- 🟡 **Amarillo:** En proceso  
- 🟢 **Verde:** Resuelto
- ⚡ **Pulso:** Crítico (>48h)

## 📊 Dashboard

### Métricas Principales
- Tiempo promedio de resolución
- Reportes críticos pendientes
- Distribución por estado
- Zonas con más problemas

### Exportación
- **PDF:** Resumen ejecutivo
- **CSV:** Datos crudos para análisis
- **Filtros:** Por fecha, estado, zona

## 🔔 Notificaciones

### Tipos
- **Push:** Tiempo real (Firebase)
- **Toast:** Alertas temporales
- **Email:** Resúmenes diarios

### Eventos
- Nuevo reporte asignado
- Cambio de estado
- Nuevo comentario
- Reporte crítico (>48h)

## 🧪 Testing

### Prueba de Notificaciones
1. Ve a `/test-notifications`
2. Prueba diferentes tipos de alertas
3. Verifica comentarios en tiempo real
4. Prueba notificaciones push

### Usuarios de Prueba
```bash
# Ciudadano
Email: ciudadano@test.com
Password: password123

# Autoridad  
Email: autoridad@test.com
Password: password123

# Admin
Email: admin@test.com
Password: password123
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── UI/            # Componentes base (Button, Card, etc.)
│   ├── Map/           # Componentes de mapas
│   ├── Dashboard/     # Componentes del dashboard
│   ├── Reports/       # Componentes de reportes
│   └── Notifications/ # Componentes de notificaciones
├── pages/             # Páginas principales
├── store/             # Contextos globales
├── hooks/             # Hooks personalizados
├── services/          # Servicios de API
└── utils/             # Utilidades
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
```

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Hydora
VITE_APP_VERSION=1.0.0
```

### Backend
Asegúrate de que el backend esté corriendo en `http://localhost:3000`

## 📝 Notas de Desarrollo

### Estado de Carga
- Skeletons uniformes para todos los componentes
- Estados de error con retry
- Mensajes vacíos informativos

### Microinteracciones
- Hover en tarjetas con elevación
- Pulso en reportes críticos
- Transiciones suaves en cambios de estado

### Accesibilidad
- Focus visible en todos los elementos
- ARIA labels apropiados
- Navegación por teclado completa
- Soporte para screen readers

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
