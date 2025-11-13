const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario existe en req.user (del middleware auth)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado'
        });
      }

      // Verificar que el rol del usuario está permitido
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para realizar esta acción'
        });
      }

      next();
    } catch (error) {
      console.error('Error en middleware authorize:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

module.exports = authorize; 