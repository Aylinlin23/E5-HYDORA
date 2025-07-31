const express = require('express');
const ReportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - latitude
 *         - longitude
 *       properties:
 *         title:
 *           type: string
 *           description: Título del reporte
 *         description:
 *           type: string
 *           description: Descripción detallada del problema
 *         latitude:
 *           type: number
 *           format: float
 *           description: Latitud de la ubicación
 *         longitude:
 *           type: number
 *           format: float
 *           description: Longitud de la ubicación
 *         address:
 *           type: string
 *           description: Dirección opcional
 *         photos:
 *           type: string
 *           description: URLs de las fotos separadas por comas
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *           default: MEDIUM
 *           description: Prioridad del reporte
 *         statusHistory:
 *           type: array
 *           description: Historial de cambios de estado
 *           items:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               changedBy:
 *                 type: string
 *               changedAt:
 *                 type: string
 *               reason:
 *                 type: string
 *     ReportResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         report:
 *           $ref: '#/components/schemas/Report'
 *     ReportUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Crear un nuevo reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateToken, ReportController.create);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener todos los reportes (con filtros)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *         description: Filtrar por estado
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateToken, ReportController.getAll);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Obtener un reporte específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *       404:
 *         description: Reporte no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', authenticateToken, ReportController.getById);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Actualizar un reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportUpdate'
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *       404:
 *         description: Reporte no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', authenticateToken, ReportController.update);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Eliminar un reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Reporte no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: No autorizado
 */
/**
 * @swagger
 * /api/reports/{id}/status:
 *   patch:
 *     summary: Cambiar estado de un reporte (solo autoridades)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *                 description: Nuevo estado del reporte
 *               reason:
 *                 type: string
 *                 description: Razón del cambio de estado (opcional)
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *       404:
 *         description: Reporte no encontrado
 *       403:
 *         description: Solo autoridades pueden cambiar estados
 *       401:
 *         description: No autorizado
 */
/**
 * @swagger
 * /api/reports/stats/overview:
 *   get:
 *     summary: Obtener estadísticas generales (solo autoridades y admins)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byStatus:
 *                       type: object
 *                     byPriority:
 *                       type: object
 *                     recentReports:
 *                       type: array
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo autoridades y admins pueden ver estadísticas
 */
router.get('/stats/overview', authenticateToken, authorizeRoles('AUTHORITY', 'ADMIN'), ReportController.getStats);

router.patch('/:id/status', authenticateToken, authorizeRoles('AUTHORITY', 'ADMIN'), ReportController.updateStatus);

router.delete('/:id', authenticateToken, ReportController.delete);

module.exports = router; 