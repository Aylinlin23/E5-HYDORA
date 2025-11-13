const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'hydora_jwt_secret_key_2024_very_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Utilidades
const generateToken = () => crypto.randomBytes(32).toString('hex');
const generateJWT = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Validaciones
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password.length >= 6;
};

// Controladores

// 1. Auto-registro (ciudadano)
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son obligatorios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Generar token de verificación
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: 'CITIZEN',
        status: 'ACTIVE', // Cambiado de PENDING_VERIFICATION a ACTIVE para desarrollo
        emailVerified: true, // Cambiado a true para desarrollo
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Generar JWT
    const token = generateJWT(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          address: user.address,
          emailVerified: user.emailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 2. Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar estado del usuario
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido suspendida'
      });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está inactiva'
      });
    }

    // Para usuarios pendientes de verificación, permitir login pero mostrar mensaje
    if (user.status === 'PENDING_VERIFICATION') {
      // Generar JWT
      const token = generateJWT(user);

      res.json({
        success: true,
        message: 'Login exitoso. Tu cuenta está pendiente de verificación de email.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.phone,
            address: user.address,
            emailVerified: user.emailVerified
          },
          token
        }
      });
      return;
    }

    // Generar JWT
    const token = generateJWT(user);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          address: user.address,
          emailVerified: user.emailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 3. Verificar email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Activar usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    res.json({
      success: true,
      message: 'Email verificado exitosamente'
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 3.5. Activar usuario manualmente (para desarrollo)
const activateUser = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Activar usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    res.json({
      success: true,
      message: `Usuario ${email} activado exitosamente`
    });

  } catch (error) {
    console.error('Error activando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 4. Crear usuario (admin/authority)
const createUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, sendInvitation } = req.body;
    const { id: creatorId } = req.user; // Del middleware auth

    // Verificar permisos
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (creator.role !== 'ADMIN' && creator.role !== 'AUTHORITY') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para crear usuarios'
      });
    }

    // Validaciones
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y rol son obligatorios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    let userData = {
      name,
      email,
      role,
      phone,
      address,
      invitedBy: creatorId
    };

    if (sendInvitation) {
      // Crear invitación
      const invitationToken = generateToken();
      const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

      await prisma.invitation.create({
        data: {
          email,
          role,
          token: invitationToken,
          expiresAt: invitationExpires,
          createdBy: creatorId
        }
      });

      userData.status = 'PENDING_VERIFICATION';
      userData.password = await bcrypt.hash(generateToken(), BCRYPT_ROUNDS); // Contraseña temporal

      // TODO: Enviar email de invitación
      console.log(`Invitación enviada a ${email} con token: ${invitationToken}`);

    } else {
      // Crear usuario con contraseña temporal
      const tempPassword = generateToken();
      userData.password = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);
      userData.status = 'ACTIVE';

      // TODO: Enviar email con contraseña temporal
      console.log(`Usuario creado con contraseña temporal: ${tempPassword}`);
    }

    const user = await prisma.user.create({
      data: userData
    });

    res.status(201).json({
      success: true,
      message: sendInvitation ? 'Invitación enviada exitosamente' : 'Usuario creado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 5. Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const { id } = req.user; // Cambiado de userId a id

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 6. Actualizar perfil
const updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // Cambiado de userId a id
    const { name, phone, address } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 7. Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { id } = req.user; // Cambiado de userId a id
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son obligatorias'
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario con contraseña
    const user = await prisma.user.findUnique({
      where: { id }
    });

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 8. Listar usuarios (admin)
const listUsers = async (req, res) => {
  try {
    const { id } = req.user; // Cambiado de userId a id
    const { page = 1, limit = 10, role, status, search } = req.query;

    // Verificar permisos
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver usuarios'
      });
    }

    // Construir filtros
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Obtener usuarios
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        invitedBy: true
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    // Contar total
    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 9. Actualizar usuario (admin)
const updateUser = async (req, res) => {
  try {
    const { id: adminId } = req.user;
    const { id: targetUserId } = req.params;
    const { name, email, role, status, phone, address } = req.body;

    // Verificar permisos
    const admin = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (admin.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar usuarios'
      });
    }

    // Verificar que el usuario existe
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        name: name || undefined,
        email: email || undefined,
        role: role || undefined,
        status: status || undefined,
        phone: phone || undefined,
        address: address || undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// 10. Obtener estadísticas del usuario
const getUserStats = async (req, res) => {
  try {
    const { id } = req.user;

    // Obtener todos los reportes del usuario
    const userReports = await prisma.report.findMany({
      where: { userId: id },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular estadísticas
    const totalReports = userReports.length;
    const pendingReports = userReports.filter(report => report.status === 'PENDING').length;
    const resolvedReports = userReports.filter(report => report.status === 'RESOLVED').length;
    const inProgressReports = userReports.filter(report => report.status === 'IN_PROGRESS').length;
    const rejectedReports = userReports.filter(report => report.status === 'REJECTED').length;

    // Calcular tiempo promedio de resolución (solo para reportes resueltos)
    let averageResponseTime = 0;
    if (resolvedReports > 0) {
      const resolvedReportTimes = userReports
        .filter(report => report.status === 'RESOLVED')
        .map(report => {
          const created = new Date(report.createdAt);
          const updated = new Date(report.updatedAt);
          return (updated - created) / (1000 * 60 * 60 * 24); // Convertir a días
        });
      
      const totalTime = resolvedReportTimes.reduce((sum, time) => sum + time, 0);
      averageResponseTime = Math.round((totalTime / resolvedReports) * 10) / 10; // Redondear a 1 decimal
    }

    // Obtener última actividad (último reporte creado o comentario)
    const lastReport = userReports[0]; // Ya están ordenados por fecha de creación descendente
    
    // Buscar último comentario del usuario
    const lastComment = await prisma.reportComment.findFirst({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    // Determinar última actividad
    let lastActivity = null;
    if (lastReport && lastComment) {
      lastActivity = new Date(lastReport.createdAt) > new Date(lastComment.createdAt) 
        ? lastReport.createdAt 
        : lastComment.createdAt;
    } else if (lastReport) {
      lastActivity = lastReport.createdAt;
    } else if (lastComment) {
      lastActivity = lastComment.createdAt;
    }

    // Si no hay actividad, usar fecha de creación del usuario
    if (!lastActivity) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { createdAt: true }
      });
      lastActivity = user.createdAt;
    }

    res.json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        resolvedReports,
        inProgressReports,
        rejectedReports,
        averageResponseTime,
        lastActivity: lastActivity.toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  activateUser,
  createUser,
  getProfile,
  updateProfile,
  changePassword,
  listUsers,
  updateUser,
  getUserStats
}; 