const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email/:token', userController.verifyEmail);

// Ruta para activar usuarios manualmente (solo para desarrollo)
router.post('/activate/:email', userController.activateUser);

// Rutas protegidas - Perfil del usuario
router.get('/me', authenticateToken, userController.getProfile);
router.patch('/me', authenticateToken, userController.updateProfile);
router.patch('/change-password', authenticateToken, userController.changePassword);
router.get('/stats', authenticateToken, userController.getUserStats);

// Rutas protegidas - Gestión de usuarios (admin/authority)
router.post('/create', authenticateToken, authorize(['ADMIN', 'AUTHORITY']), userController.createUser);

// Rutas protegidas - Administración (solo admin)
router.get('/list', authenticateToken, authorize(['ADMIN']), userController.listUsers);
router.patch('/:id', authenticateToken, authorize(['ADMIN']), userController.updateUser);

module.exports = router; 