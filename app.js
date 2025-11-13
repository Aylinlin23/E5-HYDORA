const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Cargar variables de entorno desde múltiples archivos
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../env.local') });

// Verificar variables de entorno críticas
console.log('🔧 Variables de entorno cargadas:');
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'NO CONFIGURADO');
console.log('🔧 JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO');
console.log('🔧 JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
console.log('🔧 BCRYPT_ROUNDS:', process.env.BCRYPT_ROUNDS);
console.log('🔧 PORT:', process.env.PORT);

// Importar configuración de base de datos
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hydora API',
      version: '1.0.0',
      description: 'API para reportar fugas y desvíos de agua',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas donde buscar documentación
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Hydora',
    version: '1.0.0',
    documentation: `/api-docs`
  });
});

// Importar y usar rutas
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Conectar a la base de datos y iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; 