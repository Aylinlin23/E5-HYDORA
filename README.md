# Hydora Frontend

Aplicación frontend para el sistema de reportes de fugas de agua Hydora, desarrollada con React (web) y React Native (móvil).

## 🚀 Características Implementadas

### ✅ Paso 1: Inicialización y Base Compartida
- [x] Proyectos web (React/Vite) y móvil (Expo/React Native) inicializados
- [x] Estructura de carpetas organizada
- [x] Dependencias core instaladas
- [x] Cliente API con interceptores JWT
- [x] AuthContext para gestión de autenticación
- [x] Navegación básica y pantallas placeholder

### ✅ Paso 2: Login, Persistencia y Menú Dinámico
- [x] Login funcional con persistencia
- [x] Menú dinámico basado en roles (ciudadano, autoridad, admin)
- [x] Pantalla de perfil con información del usuario
- [x] Persistencia de sesión en localStorage/AsyncStorage

### ✅ Paso 3: Crear y Administrar Reportes (Ciudadano)
- [x] Pantalla de creación de reportes con geolocalización
- [x] Pantalla "Mis Reportes" con filtros y búsqueda
- [x] Vista detallada de reportes con evidencia visual
- [x] Validaciones de formularios
- [x] Historial de cambios de estado

### ✅ Paso 4: Mapa Interactivo y Visualización Geoespacial
- [x] Integración de mapas (Leaflet.js para web, react-native-maps para móvil)
- [x] Marcadores color-coded por estado de reportes
- [x] Filtros por estado y proximidad
- [x] Vistas diferenciadas para usuarios públicos vs autoridades
- [x] Geolocalización automática

### ✅ Paso 5: Guía Educativa y Notificaciones
- [x] Sección "Guía de reúso de agua" con contenido educativo
- [x] Sistema de notificaciones en tiempo real (simulado)
- [x] Alertas tipo toast para cambios de estado
- [x] Historial corto de notificaciones
- [x] Polling ligero para detectar cambios

### ✅ Paso 6: Panel de Autoridad y Admin
- [x] Panel de autoridad con gestión completa de reportes
- [x] Panel de administración con gestión de usuarios
- [x] Filtros avanzados por estado, prioridad y fecha
- [x] Cambio de estados de reportes
- [x] Gestión de roles de usuarios
- [x] Métricas y estadísticas del sistema

### ✅ Paso 7: Extras y Pulido
- [x] **Soporte de dark mode básico** con ThemeContext
- [x] **Carga de imágenes mejorada** con preview y compresión
- [x] **Exportación a PDF** desde panel de autoridad
- [x] **Componentes de loading uniformes** (spinners, skeletons)
- [x] **Cache ligero de listas** con TTL configurable
- [x] **Accesibilidad mínima** (etiquetas, contraste, navegación por teclado)
- [x] **Manejo de estados globales** mejorado

## 🛠️ Tecnologías Utilizadas

### Web (React)
- **React 18** con Vite
- **React Router DOM** para navegación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **Leaflet.js** para mapas
- **jsPDF** para exportación PDF
- **Context API** para estado global

### Móvil (React Native)
- **React Native** con Expo
- **React Navigation** para navegación
- **Expo Location** para geolocalización
- **react-native-maps** para mapas
- **AsyncStorage** para persistencia
- **Animated API** para animaciones

## 📁 Estructura del Proyecto

```
frontend/
├── web/                    # Aplicación web (React)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── store/         # Contextos y estado global
│   │   ├── services/      # Servicios API
│   │   ├── hooks/         # Hooks personalizados
│   │   └── navigation/    # Configuración de rutas
│   └── public/            # Archivos estáticos
├── mobile/                # Aplicación móvil (React Native)
│   ├── src/
│   │   ├── components/    # Componentes móviles
│   │   ├── screens/       # Pantallas de la app
│   │   ├── store/         # Contextos móviles
│   │   ├── services/      # Servicios API móviles
│   │   └── navigation/    # Navegación móvil
│   └── assets/            # Recursos móviles
└── README.md              # Este archivo
```

## 🎨 Características de UX/UI

### Dark Mode
- ✅ Toggle automático de tema
- ✅ Detección de preferencia del sistema
- ✅ Persistencia de preferencia
- ✅ Colores adaptados para ambos temas

### Carga de Imágenes
- ✅ Preview antes de subir
- ✅ Compresión automática (800x600px, calidad 0.8)
- ✅ Drag & drop
- ✅ Validación de tipos y tamaños
- ✅ Contador de imágenes

### Exportación PDF
- ✅ Generación de PDFs completos
- ✅ Información detallada del reporte
- ✅ Historial de estados
- ✅ Formato profesional

### Accesibilidad
- ✅ Etiquetas ARIA apropiadas
- ✅ Navegación por teclado
- ✅ Contraste mejorado
- ✅ Skip links
- ✅ Anuncios de estado

### Cache y Performance
- ✅ Cache de reportes con TTL
- ✅ Cache de usuarios
- ✅ Limpieza automática de cache expirado
- ✅ Loading states optimizados

## 🚀 Instalación y Uso

### Web
```bash
cd frontend/web
npm install
npm run dev
```

### Móvil
```bash
cd frontend/mobile
npm install
npx expo start
```

## 🔧 Configuración

### Variables de Entorno (Web)
```env
VITE_API_URL=http://localhost:3000/api
```

### Variables de Entorno (Móvil)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 📱 Funcionalidades por Rol

### 👤 Ciudadano
- Crear reportes con fotos y geolocalización
- Ver sus reportes con filtros
- Recibir notificaciones de cambios
- Acceder a guía educativa

### 👮 Autoridad
- Ver todos los reportes
- Cambiar estados de reportes
- Filtrar por prioridad y estado
- Exportar reportes a PDF

### 👑 Administrador
- Gestión completa de usuarios
- Cambiar roles y estados de usuarios
- Ver métricas del sistema
- Acceso a todos los paneles

## 🎯 Próximos Pasos

### Funcionalidades Futuras
- [ ] **Paso 8: Estadísticas avanzadas** con gráficos
- [ ] **Paso 9: Funcionalidades avanzadas** (comentarios, prioridades automáticas)
- [ ] **Paso 10: Optimizaciones** (paginación, búsqueda avanzada)
- [ ] **Notificaciones push reales** con WebSockets
- [ ] **Integración con servicios externos** (mapas offline, APIs meteorológicas)

### Mejoras Técnicas
- [ ] **Testing** con Jest y React Testing Library
- [ ] **PWA** para instalación offline
- [ ] **Optimización de bundle** y lazy loading
- [ ] **Internacionalización** (i18n)
- [ ] **Analytics** y métricas de uso

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Frontend**: Implementación de interfaces web y móvil
- **UX/UI Designer**: Diseño de experiencias de usuario
- **QA Tester**: Pruebas de funcionalidad y accesibilidad

---

**Hydora** - Sistema de Reportes de Fugas de Agua 