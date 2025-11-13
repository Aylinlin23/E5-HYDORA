const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

class AuthController {
  // Registrar nuevo usuario
  static async register(req, res) {
    try {
      const { email, password, name, role = 'CITIZEN' } = req.body;

      // Validaciones básicas
      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Datos requeridos',
          message: 'Email, contraseña y nombre son obligatorios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Contraseña inválida',
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'El email ya está registrado'
        });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      // Generar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo registrar el usuario'
      });
    }
  }

  // Iniciar sesión
  static async login(req, res) {
    try {
      console.log('🔍 Login request recibido:', { email: req.body.email });
      
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        console.log('❌ Datos faltantes:', { email: !!email, password: !!password });
        return res.status(400).json({
          error: 'Datos requeridos',
          message: 'Email y contraseña son obligatorios'
        });
      }

      console.log('🔍 Buscando usuario en la base de datos...');
      
      // Buscar usuario
      const user = await prisma.user.findUnique({
        where: { email }
      });

      console.log('🔍 Usuario encontrado:', user ? 'Sí' : 'No');

      if (!user) {
        console.log('❌ Usuario no encontrado para email:', email);
        return res.status(401).json({
          error: 'Credenciales incorrectas',
          message: 'Email o contraseña incorrectos'
        });
      }

      console.log('🔍 Verificando contraseña...');
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);

      console.log('🔍 Contraseña válida:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Contraseña incorrecta para usuario:', email);
        return res.status(401).json({
          error: 'Credenciales incorrectas',
          message: 'Email o contraseña incorrectos'
        });
      }

      console.log('🔍 Generando token JWT...');
      
      // Generar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      console.log('🔍 Token generado exitosamente');

      // Retornar respuesta sin contraseña
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Login exitoso para usuario:', user.email);

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('💥 Error en login:', error);
      console.error('💥 Stack trace:', error.stack);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo procesar el login'
      });
    }
  }

  // Obtener información del usuario actual
  static async getCurrentUser(req, res) {
    try {
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo obtener la información del usuario'
      });
    }
  }

  // Renovar token
  static async refreshToken(req, res) {
    try {
      // El middleware authenticateToken ya verificó el token
      // Solo necesitamos generar uno nuevo
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        token
      });
    } catch (error) {
      console.error('Error renovando token:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo renovar el token'
      });
    }
  }
}

module.exports = AuthController; 