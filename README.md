# Hydora Backend

Backend para la aplicación Hydora que permite a ciudadanos reportar fugas o desvíos de agua con fotos y geolocalización, y a autoridades gestionarlos.

## Características

- 🔐 Autenticación JWT segura
- 👥 Sistema de roles (ADMIN, AUTHORITY, CITIZEN)
- 📝 CRUD completo de reportes
- 📍 Geolocalización de reportes
- 📸 Soporte para múltiples fotos
- 📊 Paginación y filtros
- 📚 Documentación automática con Swagger
- 🗄️ Base de datos PostgreSQL con Prisma ORM

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Swagger** - Documentación de API

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tus configuraciones
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar el cliente de Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma migrate dev --name init
   
   # Crear usuarios de prueba
   npm run seed
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Base de datos PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/hydora"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Configuración de la aplicación
BCRYPT_ROUNDS=12
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── app.js              # Archivo principal de la aplicación
│   ├── middleware/
│   │   └── auth.js         # Middleware de autenticación
│   └── routes/
│       ├── auth.js         # Rutas de autenticación
│       └── reports.js      # Rutas de reportes
├── prisma/
│   ├── schema.prisma       # Esquema de la base de datos
│   └── prisma.config.js    # Configuración de Prisma
├── package.json
└── README.md
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario actual

### Reportes

- `POST /api/reports` - Crear nuevo reporte
- `GET /api/reports` - Obtener reportes (con filtros y paginación)
- `GET /api/reports/:id` - Obtener reporte específico
- `PUT /api/reports/:id` - Actualizar reporte
- `DELETE /api/reports/:id` - Eliminar reporte
- `PATCH /api/reports/:id/status` - Cambiar estado (solo autoridades)
- `GET /api/reports/stats/overview` - Estadísticas (solo autoridades y admins)

## Roles y Permisos (RBAC)

### 👤 CITIZEN (Ciudadano)
- ✅ **Registrarse** en el sistema
- ✅ **Crear reportes** con fotos y geolocalización
- ✅ **Ver y editar** sus propios reportes
- ✅ **Eliminar** sus propios reportes
- ✅ **Ver el estado** de sus reportes
- ❌ No puede cambiar el estado de reportes
- ❌ No puede ver reportes de otros usuarios

### 🏛️ AUTHORITY (Autoridad)
- ✅ **Ver todos los reportes** del sistema
- ✅ **Cambiar estado** de cualquier reporte
- ✅ **Asignar reportes** a otros usuarios
- ✅ **Recibir notificaciones** de nuevos reportes
- ✅ **Acceder a detalles completos** con evidencia
- ✅ **Ver estadísticas** y métricas
- ❌ No puede eliminar reportes
- ❌ No puede gestionar usuarios

### 👑 ADMIN (Administrador)
- ✅ **Acceso completo** a todas las funcionalidades
- ✅ **Gestionar usuarios** (promover a autoridad, revocar)
- ✅ **Ver métricas** y estadísticas avanzadas
- ✅ **Configurar parámetros** globales
- ✅ **Eliminar cualquier reporte**
- ✅ **Cambiar roles** de usuarios

## Notificaciones

El sistema incluye notificaciones automáticas:

- **Nuevos reportes**: Se notifica automáticamente a las autoridades
- **Reportes de alta prioridad**: Alertas especiales para reportes URGENT/HIGH
- **Cambios de estado**: Se notifica al creador cuando cambia el estado de su reporte

Las notificaciones se registran en la consola del servidor (placeholder para futuras integraciones con email/SMS).

## Documentación

La documentación interactiva de la API está disponible en:
- **Desarrollo**: http://localhost:3000/api-docs
- **Producción**: https://tu-dominio.com/api-docs

## Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm run seed` - Ejecutar seed para crear usuarios de prueba
- `npx prisma generate` - Generar cliente de Prisma
- `npx prisma migrate dev` - Ejecutar migraciones
- `npx prisma studio` - Abrir interfaz visual de la base de datos

## Base de Datos

### Modelos

#### User
- `id` - Identificador único
- `email` - Email único del usuario
- `password` - Contraseña encriptada
- `name` - Nombre completo
- `role` - Rol del usuario (ADMIN, AUTHORITY, CITIZEN)
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

#### Report
- `id` - Identificador único
- `title` - Título del reporte
- `description` - Descripción detallada
- `latitude` - Latitud de la ubicación
- `longitude` - Longitud de la ubicación
- `address` - Dirección opcional
- `photos` - Array de URLs de fotos
- `status` - Estado del reporte (PENDING, IN_PROGRESS, RESOLVED, REJECTED)
- `priority` - Prioridad (LOW, MEDIUM, HIGH, URGENT)
- `userId` - ID del usuario que creó el reporte
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

## Usuarios de Prueba

Después de ejecutar `npm run seed`, tendrás estos usuarios disponibles:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@hydora.com` | `admin123` | ADMIN |
| `autoridad@hydora.com` | `autoridad123` | AUTHORITY |
| `ciudadano@hydora.com` | `ciudadano123` | CITIZEN |
| `ana@ejemplo.com` | `ana123` | CITIZEN |

## Ejemplos de Uso

### 1. Login para obtener token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
         "email": "ciudadano@hydora.com",
    "password": "ciudadano123"
  }'
```

### 2. Crear un reporte (con token)
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "title": "Fuga de agua en la calle",
    "description": "Hay una fuga importante en la esquina",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "address": "Av. Reforma 123",
    "photos": "https://ejemplo.com/foto1.jpg,https://ejemplo.com/foto2.jpg",
    "priority": "HIGH"
  }'
```

### 3. Ver reportes (con filtros)
```bash
# Ver todos los reportes
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  http://localhost:3000/api/reports

# Filtrar por estado
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  "http://localhost:3000/api/reports?status=PENDING"

# Con paginación
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  "http://localhost:3000/api/reports?page=1&limit=5"
```

### 4. Cambiar estado de reporte (solo autoridades)
```bash
curl -X PATCH http://localhost:3000/api/reports/REPORT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "status": "IN_PROGRESS",
    "reason": "Equipo de mantenimiento asignado"
  }'
```

### 5. Ver estadísticas (solo autoridades y admins)
```bash
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  http://localhost:3000/api/reports/stats/overview
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 