/**
 * Utilidades para notificaciones (placeholder)
 * En el futuro se puede integrar con servicios como:
 * - Email (SendGrid, Mailgun)
 * - SMS (Twilio)
 * - Push notifications
 * - Webhooks
 */

// Simular envío de notificación por email
const sendEmailNotification = async (to, subject, message) => {
  console.log(`📧 Email enviado a: ${to}`);
  console.log(`📧 Asunto: ${subject}`);
  console.log(`📧 Mensaje: ${message}`);
  
  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    messageId: `email_${Date.now()}`,
    sentAt: new Date().toISOString()
  };
};

// Simular envío de notificación SMS
const sendSMSNotification = async (to, message) => {
  console.log(`📱 SMS enviado a: ${to}`);
  console.log(`📱 Mensaje: ${message}`);
  
  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    messageId: `sms_${Date.now()}`,
    sentAt: new Date().toISOString()
  };
};

// Notificar a autoridades sobre nuevo reporte
const notifyAuthorities = async (report) => {
  const subject = `Nuevo reporte de fuga de agua - ${report.title}`;
  const message = `
    Se ha reportado una nueva fuga de agua:
    
    Título: ${report.title}
    Descripción: ${report.description}
    Ubicación: ${report.latitude}, ${report.longitude}
    Dirección: ${report.address || 'No especificada'}
    Prioridad: ${report.priority}
    Reportado por: ${report.user.name} (${report.user.email})
    
    Fecha: ${new Date(report.createdAt).toLocaleString()}
  `;

  // En un entorno real, aquí se enviarían notificaciones a las autoridades
  console.log('🚨 Notificación enviada a autoridades:', subject);
  
  return {
    success: true,
    notificationsSent: 1
  };
};

// Notificar al usuario sobre cambio de estado
const notifyUserStatusChange = async (user, report, newStatus) => {
  const subject = `Actualización de tu reporte - ${report.title}`;
  const message = `
    Hola ${user.name},
    
    Tu reporte ha sido actualizado:
    
    Título: ${report.title}
    Nuevo estado: ${newStatus}
    Fecha de actualización: ${new Date().toLocaleString()}
    
    Gracias por tu colaboración en mantener nuestra ciudad limpia.
  `;

  // En un entorno real, aquí se enviaría la notificación al usuario
  console.log(`📧 Notificación enviada a ${user.email}:`, subject);
  
  return {
    success: true,
    messageId: `status_update_${Date.now()}`
  };
};

// Notificar reporte de alta prioridad
const notifyHighPriorityReport = async (report) => {
  if (report.priority === 'HIGH' || report.priority === 'URGENT') {
    const subject = `🚨 REPORTE DE ALTA PRIORIDAD - ${report.title}`;
    const message = `
      URGENTE: Se ha reportado una fuga de agua de alta prioridad:
      
      Título: ${report.title}
      Descripción: ${report.description}
      Ubicación: ${report.latitude}, ${report.longitude}
      Prioridad: ${report.priority}
      Reportado por: ${report.user.name}
      
      Requiere atención inmediata.
    `;

    console.log('🚨 ALERTA DE ALTA PRIORIDAD:', subject);
    
    return {
      success: true,
      priority: 'high',
      messageId: `urgent_${Date.now()}`
    };
  }
  
  return { success: false, reason: 'Not high priority' };
};

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
  notifyAuthorities,
  notifyUserStatusChange,
  notifyHighPriorityReport
}; 