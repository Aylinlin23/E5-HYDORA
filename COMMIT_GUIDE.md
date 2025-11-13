# Guía de Commits - Hydora Backend

## Estructura de Commits

Usa el formato: `tipo: descripción breve`

### Tipos de Commit

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Documentación
- `style:` - Cambios de formato (no afectan funcionalidad)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

## Commits Sugeridos para el Proyecto Inicial

### 1. Inicialización del Proyecto
```bash
git add .
git commit -m "feat: inicializar proyecto y dependencias"
```

### 2. Configuración de Base de Datos
```bash
git add prisma/
git commit -m "feat: modelo prisma de User y Report"
```

### 3. Autenticación
```bash
git add src/middleware/ src/controllers/authController.js src/routes/auth.js
git commit -m "feat: autenticación JWT y middleware"
```

### 4. CRUD de Reportes
```bash
git add src/controllers/reportController.js src/routes/reports.js
git commit -m "feat: CRUD de reportes básico"
```

### 5. Utilidades y Configuración
```bash
git add src/utils/ src/config/
git commit -m "feat: utilidades, validaciones y configuración"
```

### 6. Documentación
```bash
git add README.md src/routes/*.js
git commit -m "docs: swagger y README inicial"
```

### 7. Scripts y Seed
```bash
git add prisma/seed.js package.json
git commit -m "feat: script de seed y usuarios de prueba"
```

### 8. Notificaciones
```bash
git add src/utils/notifications.js src/controllers/reportController.js
git commit -m "feat: sistema de notificaciones placeholder"
```

## Ejemplos de Commits Futuros

```bash
# Agregar nueva funcionalidad
git commit -m "feat: agregar filtros por proximidad geográfica"

# Corregir bug
git commit -m "fix: validación de coordenadas en reportes"

# Mejorar documentación
git commit -m "docs: agregar ejemplos de uso en README"

# Refactorizar código
git commit -m "refactor: optimizar consultas de base de datos"

# Agregar tests
git commit -m "test: agregar tests para autenticación"
```

## Consejos

1. **Sé específico**: Describe exactamente qué cambió
2. **Usa imperativo**: "agregar" no "agregado"
3. **Mantén descripciones cortas**: Máximo 50 caracteres
4. **Separa cambios grandes**: Un commit por funcionalidad
5. **Incluye contexto**: Si es necesario, agrega cuerpo al commit

## Ejemplo de Commit Completo

```bash
git commit -m "feat: agregar filtros por proximidad geográfica

- Implementar búsqueda por radio de distancia
- Agregar parámetros lat, lng, radius en GET /reports
- Optimizar consultas con índices espaciales
- Agregar validaciones de coordenadas"
``` 