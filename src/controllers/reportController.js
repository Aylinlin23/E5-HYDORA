const { prisma } = require('../config/database');
const { notifyAuthorities, notifyHighPriorityReport, notifyUserStatusChange } = require('../utils/notifications');

class ReportController {
  // Crear nuevo reporte
  static async create(req, res) {
    try {
      const { title, description, latitude, longitude, address, photos = '', priority = 'MEDIUM' } = req.body;

      // Validaciones básicas
      if (!title || !description || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          error: 'Datos requeridos',
          message: 'Título, descripción, latitud y longitud son obligatorios'
        });
      }

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({
          error: 'Coordenadas inválidas',
          message: 'Latitud y longitud deben ser números'
        });
      }

              // Crear reporte
        const report = await prisma.report.create({
          data: {
            title,
            description,
            latitude,
            longitude,
            address,
            photos: Array.isArray(photos) ? photos.join(',') : photos,
            priority,
            userId: req.user.id
          },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

          // Enviar notificaciones
    try {
      await notifyAuthorities(report);
      await notifyHighPriorityReport(report);
    } catch (notificationError) {
      console.warn('⚠️ Error enviando notificaciones:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      report
    });

    } catch (error) {
      console.error('Error creando reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo crear el reporte'
      });
    }
  }

  // Obtener todos los reportes con filtros
  static async getAll(req, res) {
    try {
      const { status, priority, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Construir filtros
      const where = {};
      
      if (status) where.status = status;
      if (priority) where.priority = priority;
      
      // Si es ciudadano, solo ver sus reportes
      if (req.user.role === 'CITIZEN') {
        where.userId = req.user.id;
      }

      // Obtener reportes con paginación
      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.report.count({ where })
      ]);

      const pages = Math.ceil(total / parseInt(limit));

      res.json({
        success: true,
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages
        }
      });

    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los reportes'
      });
    }
  }

  // Obtener reporte específico
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const report = await prisma.report.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!report) {
        return res.status(404).json({
          error: 'Reporte no encontrado',
          message: 'El reporte especificado no existe'
        });
      }

      // Verificar permisos: ciudadanos solo pueden ver sus propios reportes
      if (req.user.role === 'CITIZEN' && report.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tiene permisos para ver este reporte'
        });
      }

      // Parsear historial de estado
      let statusHistory = [];
      try {
        statusHistory = JSON.parse(report.statusHistory || '[]');
      } catch (e) {
        statusHistory = [];
      }

      res.json({
        success: true,
        report: {
          ...report,
          statusHistory: statusHistory
        }
      });

    } catch (error) {
      console.error('Error obteniendo reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el reporte'
      });
    }
  }

  // Actualizar reporte
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, priority } = req.body;

      // Verificar que el reporte existe
      const existingReport = await prisma.report.findUnique({
        where: { id }
      });

      if (!existingReport) {
        return res.status(404).json({
          error: 'Reporte no encontrado',
          message: 'El reporte especificado no existe'
        });
      }

      // Verificar permisos
      if (req.user.role === 'CITIZEN') {
        // Ciudadanos solo pueden actualizar sus propios reportes y solo ciertos campos
        if (existingReport.userId !== req.user.id) {
          return res.status(403).json({
            error: 'Acceso denegado',
            message: 'No tiene permisos para actualizar este reporte'
          });
        }
        
        // Ciudadanos no pueden cambiar el estado
        if (status) {
          return res.status(403).json({
            error: 'Acceso denegado',
            message: 'Los ciudadanos no pueden cambiar el estado de los reportes'
          });
        }
      }

      // Construir datos de actualización
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (status && ['ADMIN', 'AUTHORITY'].includes(req.user.role)) updateData.status = status;
      if (priority) updateData.priority = priority;

          const report = await prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Notificar cambio de estado si se cambió
    if (status && status !== existingReport.status) {
      try {
        await notifyUserStatusChange(report.user, report, status);
      } catch (notificationError) {
        console.warn('⚠️ Error enviando notificación de cambio de estado:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Reporte actualizado exitosamente',
      report
    });

    } catch (error) {
      console.error('Error actualizando reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el reporte'
      });
    }
  }

  // Cambiar estado de reporte (solo autoridades)
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validar estado
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Estado inválido',
          message: 'El estado debe ser uno de: PENDING, IN_PROGRESS, RESOLVED, REJECTED'
        });
      }

      // Verificar que el reporte existe
      const existingReport = await prisma.report.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!existingReport) {
        return res.status(404).json({
          error: 'Reporte no encontrado',
          message: 'El reporte especificado no existe'
        });
      }

      // Solo actualizar si el estado cambió
      if (existingReport.status === status) {
        return res.status(400).json({
          error: 'Estado sin cambios',
          message: 'El reporte ya tiene ese estado'
        });
      }

      // Obtener historial actual
      let statusHistory = [];
      try {
        statusHistory = JSON.parse(existingReport.statusHistory || '[]');
      } catch (e) {
        statusHistory = [];
      }

      // Agregar nuevo cambio al historial
      const statusChange = {
        from: existingReport.status,
        to: status,
        changedBy: req.user.name,
        changedAt: new Date().toISOString(),
        reason: req.body.reason || 'Cambio de estado por autoridad'
      };

      statusHistory.push(statusChange);

      // Actualizar estado y historial
      const report = await prisma.report.update({
        where: { id },
        data: { 
          status,
          statusHistory: JSON.stringify(statusHistory)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Notificar cambio de estado
      try {
        await notifyUserStatusChange(report.user, report, status);
      } catch (notificationError) {
        console.warn('⚠️ Error enviando notificación de cambio de estado:', notificationError);
      }

      res.json({
        success: true,
        message: `Estado del reporte actualizado a: ${status}`,
        report: {
          ...report,
          statusHistory: statusHistory
        }
      });

    } catch (error) {
      console.error('Error actualizando estado del reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el estado del reporte'
      });
    }
  }

  // Obtener estadísticas (solo autoridades y admins)
  static async getStats(req, res) {
    try {
      // Obtener estadísticas generales
      const [totalReports, byStatus, byPriority, recentReports] = await Promise.all([
        prisma.report.count(),
        prisma.report.groupBy({
          by: ['status'],
          _count: {
            status: true
          }
        }),
        prisma.report.groupBy({
          by: ['priority'],
          _count: {
            priority: true
          }
        }),
        prisma.report.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        })
      ]);

      // Formatear estadísticas por estado
      const statusStats = {};
      byStatus.forEach(item => {
        statusStats[item.status] = item._count.status;
      });

      // Formatear estadísticas por prioridad
      const priorityStats = {};
      byPriority.forEach(item => {
        priorityStats[item.priority] = item._count.priority;
      });

      res.json({
        success: true,
        stats: {
          total: totalReports,
          byStatus: statusStats,
          byPriority: priorityStats,
          recentReports
        }
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas'
      });
    }
  }

  // Eliminar reporte
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el reporte existe
      const existingReport = await prisma.report.findUnique({
        where: { id }
      });

      if (!existingReport) {
        return res.status(404).json({
          error: 'Reporte no encontrado',
          message: 'El reporte especificado no existe'
        });
      }

      // Verificar permisos: solo admins y el autor pueden eliminar
      if (req.user.role !== 'ADMIN' && existingReport.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tiene permisos para eliminar este reporte'
        });
      }

      await prisma.report.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Reporte eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el reporte'
      });
    }
  }
}

module.exports = ReportController; 