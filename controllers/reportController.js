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

      // Crear reporte usando transacción para asegurar consistencia
      const result = await prisma.$transaction(async (tx) => {
        // Crear el reporte
        const report = await tx.report.create({
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

        // Registrar en el historial
        await tx.reportHistory.create({
          data: {
            reportId: report.id,
            action: 'CREATED',
            description: `Reporte creado por ${req.user.name}`,
            userId: req.user.id
          }
        });

        return report;
      });

      // Enviar notificaciones de forma asíncrona
      setImmediate(async () => {
        try {
          await notifyAuthorities(result);
          await notifyHighPriorityReport(result);
          console.log(`✅ Notificaciones enviadas para reporte ${result.id}`);
        } catch (notificationError) {
          console.warn('⚠️ Error enviando notificaciones:', notificationError);
        }
      });

      res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente. Las autoridades han sido notificadas.',
        report: result
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
      const { 
        status, 
        priority, 
        page = 1, 
        limit = 10, 
        dateFrom, 
        dateTo, 
        search,
        lat,
        lng,
        radius
      } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Construir filtros
      const where = {};
      
      if (status && status !== 'all') where.status = status;
      if (priority && priority !== 'all') where.priority = priority;
      
      // Filtros de fecha
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }
      
      // Filtro de búsqueda en título y descripción
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // Filtro geográfico (radio desde un punto)
      if (lat && lng && radius) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const radiusNum = parseFloat(radius);
        
        // Cálculo aproximado de distancia usando fórmula de Haversine
        // Para SQLite, usamos una aproximación simple
        where.AND = [
          { latitude: { gte: latNum - (radiusNum / 111) } },
          { latitude: { lte: latNum + (radiusNum / 111) } },
          { longitude: { gte: lngNum - (radiusNum / 111) } },
          { longitude: { lte: lngNum + (radiusNum / 111) } }
        ];
      }
      
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


      // Verificar permisos y ventanas de tiempo para ciudadanos
      if (req.user.role === 'CITIZEN') {
        // Solo el autor puede actualizar
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

        // Solo permitir editar dentro de los 6 días posteriores a la creación
        const now = new Date();
        const createdAt = new Date(existingReport.createdAt);
        const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation > 6) {
          return res.status(403).json({
            error: 'Ventana de edición expirada',
            message: 'Ya no puede editar este reporte. La ventana de edición de 6 días ha expirado.'
          });
        }
      }

      // Construir datos de actualización
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (status && ['ADMIN', 'AUTHORITY'].includes(req.user.role)) updateData.status = status;
      if (priority) updateData.priority = priority;

      // Usar transacción para actualizar y registrar historial
      const report = await prisma.$transaction(async (tx) => {
        const updated = await tx.report.update({
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

        // Registrar historial si el autor (o cualquier usuario) hizo cambios
        if (Object.keys(updateData).length > 0) {
          await tx.reportHistory.create({
            data: {
              reportId: id,
              action: 'UPDATED',
              description: `Reporte actualizado por ${req.user.name}`,
              userId: req.user.id
            }
          });
        }

        return updated;
      });

      // Notificar cambio de estado si se cambió
      if (status && status !== existingReport.status) {
        try {
          await notifyUserStatusChange(report, existingReport.status, status);
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
      const { status, reason } = req.body;

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

      // Usar transacción para actualizar reporte y registrar historial
      const result = await prisma.$transaction(async (tx) => {
        // Actualizar reporte
        const updatedReport = await tx.report.update({
          where: { id },
          data: { status },
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

        // Registrar en el historial
        await tx.reportHistory.create({
          data: {
            reportId: id,
            action: 'STATUS_CHANGED',
            description: `Estado cambiado de ${existingReport.status} a ${status} por ${req.user.name}${reason ? ` - Razón: ${reason}` : ''}`,
            userId: req.user.id
          }
        });

        return updatedReport;
      });

      // Notificar cambio de estado de forma asíncrona
      setImmediate(async () => {
        try {
          await notifyUserStatusChange(result, existingReport.status, status);
          console.log(`✅ Notificación de cambio de estado enviada para reporte ${id}`);
        } catch (notificationError) {
          console.warn('⚠️ Error enviando notificación de cambio de estado:', notificationError);
        }
      });

      res.json({
        success: true,
        message: `Estado del reporte actualizado a ${status} exitosamente`,
        report: result
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

  // Obtener estadísticas detalladas para dashboard
  static async getDashboardStats(req, res) {
    try {
      // Verificar permisos: solo admin y autoridad
      if (!['ADMIN', 'AUTHORITY'].includes(req.user.role)) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'Solo administradores y autoridades pueden ver estas estadísticas'
        });
      }

      // Obtener estadísticas básicas
      const [totalReports, totalUsers] = await Promise.all([
        prisma.report.count(),
        prisma.user.count()
      ]);

      // Estadísticas por estado
      const reportsByStatus = await prisma.report.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      });

      // Estadísticas por prioridad
      const reportsByPriority = await prisma.report.groupBy({
        by: ['priority'],
        _count: {
          priority: true
        }
      });

      // Estadísticas por mes (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const reportsByMonth = await prisma.report.groupBy({
        by: ['createdAt'],
        _count: {
          createdAt: true
        },
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        }
      });

      // Formatear estadísticas por estado
      const statusStats = {};
      reportsByStatus.forEach(item => {
        statusStats[item.status] = item._count.status;
      });

      // Formatear estadísticas por prioridad
      const priorityStats = {};
      reportsByPriority.forEach(item => {
        priorityStats[item.priority] = item._count.priority;
      });

      // Formatear estadísticas por mes
      const monthlyStats = {};
      reportsByMonth.forEach(item => {
        const month = item.createdAt.toISOString().slice(0, 7); // YYYY-MM
        monthlyStats[month] = (monthlyStats[month] || 0) + item._count.createdAt;
      });

      // Top zonas con más incidencias
      const topZones = await prisma.report.groupBy({
        by: ['address'],
        _count: {
          address: true
        },
        orderBy: {
          _count: {
            address: 'desc'
          }
        },
        take: 5
      });

      // Calcular tiempo promedio de resolución
      const resolvedReports = await prisma.report.findMany({
        where: {
          status: 'RESOLVED'
        },
        select: {
          createdAt: true,
          updatedAt: true
        }
      });

      let averageResolutionTime = 0;
      if (resolvedReports.length > 0) {
        const totalDays = resolvedReports.reduce((sum, report) => {
          const resolutionTime = (new Date(report.updatedAt) - new Date(report.createdAt)) / (1000 * 60 * 60 * 24);
          return sum + resolutionTime;
        }, 0);
        averageResolutionTime = Math.round(totalDays / resolvedReports.length);
      }

      // Calcular tasa de resolución
      const resolutionRate = totalReports > 0 ? (statusStats.RESOLVED || 0) / totalReports : 0;

      // Calcular tiempo promedio de respuesta (primer cambio de estado)
      const reportsWithStatusHistory = await prisma.report.findMany({
        select: {
          createdAt: true,
          statusHistory: true
        }
      });

      let averageResponseTime = 0;
      let responseCount = 0;

      reportsWithStatusHistory.forEach(report => {
        try {
          const history = JSON.parse(report.statusHistory);
          if (history.length > 1) { // Más de un cambio
            const firstChange = new Date(history[1].fecha);
            const creationTime = new Date(report.createdAt);
            const responseTime = (firstChange - creationTime) / (1000 * 60 * 60); // Horas
            averageResponseTime += responseTime;
            responseCount++;
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      });

      if (responseCount > 0) {
        averageResponseTime = Math.round(averageResponseTime / responseCount);
      }

      res.json({
        success: true,
        stats: {
          totalReports,
          totalUsers,
          reportsByStatus: statusStats,
          reportsByPriority: priorityStats,
          reportsByMonth: monthlyStats,
          topZones: topZones.map(zone => ({
            address: zone.address,
            count: zone._count.address
          })),
          averageResolutionTime,
          resolutionRate,
          averageResponseTime
        }
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas del dashboard'
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

      // Si el usuario es ciudadano, solo permitir eliminar dentro de 3 días desde la creación
      if (req.user.role === 'CITIZEN') {
        const now = new Date();
        const createdAt = new Date(existingReport.createdAt);
        const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation > 3) {
          return res.status(403).json({
            error: 'Ventana de eliminación expirada',
            message: 'Ya no puede eliminar este reporte. La ventana de eliminación de 3 días ha expirado.'
          });
        }

        // Además, solo permitir eliminar si el reporte aún no ha sido atendido (PENDING)
        if (existingReport.status !== 'PENDING') {
          return res.status(403).json({
            error: 'No se puede eliminar',
            message: 'Solo puede eliminar reportes que aún no han sido atendidos (PENDING)'
          });
        }
      }

      // Usar transacción para borrar y registrar historial
      await prisma.$transaction(async (tx) => {
        await tx.report.delete({ where: { id } });
        await tx.reportHistory.create({
          data: {
            reportId: id,
            action: 'DELETED',
            description: `Reporte eliminado por ${req.user.name}`,
            userId: req.user.id
          }
        });
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

  // Obtener reportes del usuario autenticado
  static async getUserReports(req, res) {
    try {
      const { 
        status, 
        priority, 
        page = 1, 
        limit = 10, 
        dateFrom, 
        dateTo, 
        search 
      } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Construir filtros
      const where = {
        userId: req.user.id // Solo reportes del usuario autenticado
      };
      
      if (status && status !== 'all') where.status = status;
      if (priority && priority !== 'all') where.priority = priority;
      
      // Filtros de fecha
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }
      
      // Filtro de búsqueda
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Obtener reportes
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
            },
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' }
            },
            history: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          },
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.report.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          reports,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Error obteniendo reportes del usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los reportes'
      });
    }
  }

  // Cancelar reporte por parte del autor (siempre que esté PENDING)
  static async cancel(req, res) {
    try {
      const { id } = req.params;

      const existingReport = await prisma.report.findUnique({ where: { id } });
      if (!existingReport) {
        return res.status(404).json({
          error: 'Reporte no encontrado',
          message: 'El reporte especificado no existe'
        });
      }

      // Solo el autor puede cancelar
      if (existingReport.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tiene permisos para cancelar este reporte'
        });
      }

      // Solo cancelar si está pendiente
      if (existingReport.status !== 'PENDING') {
        return res.status(400).json({
          error: 'No se puede cancelar',
          message: 'Solo se pueden cancelar reportes que aún no han sido atendidos (PENDING)'
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        // Cambiar estado a REJECTED (o un estado específico, usamos REJECTED para indicar cancelación)
        const updated = await tx.report.update({
          where: { id },
          data: { status: 'REJECTED' },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        });

        // Registrar en historial
        await tx.reportHistory.create({
          data: {
            reportId: id,
            action: 'CANCELLED_BY_USER',
            description: `Reporte cancelado por ${req.user.name}`,
            userId: req.user.id
          }
        });

        return updated;
      });

      // Notificar de la cancelación a autoridades de forma asíncrona
      setImmediate(async () => {
        try {
          await notifyAuthorities(result);
        } catch (notificationError) {
          console.warn('⚠️ Error notificando cancelación:', notificationError);
        }
      });

      res.json({ success: true, message: 'Reporte cancelado exitosamente', report: result });

    } catch (error) {
      console.error('Error cancelando reporte:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo cancelar el reporte'
      });
    }
  }
}

module.exports = ReportController; 