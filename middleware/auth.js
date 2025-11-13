const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

/**
 * Middleware para verificar el token JWT
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token de autenticación' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El usuario asociado al token no existe' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'El token de autenticación ha expirado' 
      });
    }
    
    return res.status(403).json({ 
      error: 'Token inválido',
      message: 'El token de autenticación no es válido' 
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autorizado',
        message: 'Debe estar autenticado para acceder a este recurso' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'No tiene permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
}; 