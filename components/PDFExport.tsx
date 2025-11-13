import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extender jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  user?: {
    name?: string;
  };
  createdAt: string;
  statusHistory?: string;
}

interface PDFExportProps {
  report: Report;
  onExport?: (filename: string) => void;
}

const PDFExport: React.FC<PDFExportProps> & {
  exportHistorial: (historialData: any) => string;
  exportReporteCompleto: (reporteData: any) => string;
  exportReportsList: (exportData: any) => string;
} = ({ report, onExport }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Configurar fuente para caracteres especiales
    doc.setFont('helvetica');
    
    // TÃ­tulo
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Indigo
    doc.text('Hydora - Reporte de Fuga de Agua', 20, 20);
    
    // LÃ­nea separadora
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // InformaciÃ³n del reporte
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    
    // ID del reporte
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporte #${report.id}`, 20, yPosition);
    yPosition += 10;
    
    // TÃ­tulo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`TÃ­tulo: ${report.title}`, 20, yPosition);
    yPosition += 8;
    
    // DescripciÃ³n
    const descriptionLines = doc.splitTextToSize(
      `DescripciÃ³n: ${report.description}`, 
      170
    );
    doc.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * 6 + 8;
    
    // Estado
    doc.text(`Estado: ${getStatusDisplayName(report.status)}`, 20, yPosition);
    yPosition += 8;
    
    // Prioridad
    doc.text(`Prioridad: ${getPriorityDisplayName(report.priority)}`, 20, yPosition);
    yPosition += 8;
    
    // UbicaciÃ³n
    doc.text(`UbicaciÃ³n: ${report.address || 'No especificada'}`, 20, yPosition);
    yPosition += 8;
    
    // Coordenadas
    if (report.latitude && report.longitude) {
      doc.text(`Coordenadas: ${report.latitude}, ${report.longitude}`, 20, yPosition);
      yPosition += 8;
    }
    
    // Usuario que reportÃ³
    doc.text(`Reportado por: ${report.user?.name || 'Usuario'}`, 20, yPosition);
    yPosition += 8;
    
    // Fecha de creaciÃ³n
    const createdDate = new Date(report.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Fecha de creaciÃ³n: ${createdDate}`, 20, yPosition);
    yPosition += 15;
    
    // Historial de estados
    if (report.statusHistory) {
      try {
        const history = JSON.parse(report.statusHistory);
        if (history.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Historial de Estados:', 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
                     history.slice(-5).forEach((entry: any) => {
            const entryText = `${entry.status} - ${entry.timestamp}`;
            doc.text(entryText, 25, yPosition);
            yPosition += 6;
          });
        }
      } catch (e) {
        console.error('Error parsing status history:', e);
      }
    }
    
    // Guardar PDF
    const filename = `reporte-${report.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    if (onExport) {
      onExport(filename);
    }
  };

  const getStatusDisplayName = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'RESOLVED':
        return 'Resuelto';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const getPriorityDisplayName = (priority: string): string => {
    switch (priority) {
      case 'LOW':
        return 'Baja';
      case 'MEDIUM':
        return 'Media';
      case 'HIGH':
        return 'Alta';
      case 'URGENT':
        return 'Urgente';
      default:
        return priority;
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar PDF
    </button>
  );
};

// MÃ©todo estÃ¡tico para exportar historial
PDFExport.exportHistorial = (historialData: any) => {
  const doc = new jsPDF();
  
  // Configurar fuente
  doc.setFont('helvetica');
  
  // TÃ­tulo
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246); // Indigo
  doc.text(historialData.title, 20, 20);
  
  // SubtÃ­tulo
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text(historialData.subtitle, 20, 30);
  
  // LÃ­nea separadora
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  if (historialData.data && historialData.data.length > 0) {
    // Crear tabla con el historial
         const tableData = historialData.data.map((item: any) => [
      item.fecha,
      item.usuario,
      item.estadoPrevio,
      item.estadoNuevo,
      item.comentario
    ]);
    
    // Configurar tabla
    doc.autoTable({
      startY: 45,
      head: [['Fecha', 'Usuario', 'Estado Previo', 'Estado Nuevo', 'Comentario']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Fecha
        1: { cellWidth: 30 }, // Usuario
        2: { cellWidth: 25 }, // Estado Previo
        3: { cellWidth: 25 }, // Estado Nuevo
        4: { cellWidth: 50 }  // Comentario
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 3
      }
    });
  } else {
    // Mensaje si no hay datos
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text('No hay historial disponible para este reporte.', 20, 50);
  }
  
  // Guardar PDF
  const filename = `historial-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  return filename;
};

// MÃ©todo estÃ¡tico para exportar reporte completo con historial
PDFExport.exportReporteCompleto = (reporteData: any) => {
  const doc = new jsPDF();
  
  // Configurar fuente
  doc.setFont('helvetica');
  
  // TÃ­tulo principal
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Hydora - Reporte Completo', 20, 20);
  
  // LÃ­nea separadora
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  let yPosition = 40;
  
  // InformaciÃ³n del reporte
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reporte #${reporteData.id}`, 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`TÃ­tulo: ${reporteData.titulo}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Estado: ${reporteData.estado}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Prioridad: ${reporteData.prioridad}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`UbicaciÃ³n: ${reporteData.ubicacion}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Reportado por: ${reporteData.usuario}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Fecha de creaciÃ³n: ${reporteData.fechaCreacion}`, 20, yPosition);
  yPosition += 15;
  
  // Historial detallado
  if (reporteData.historial && reporteData.historial.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial Detallado de Cambios:', 20, yPosition);
    yPosition += 10;
    
    // Crear tabla del historial
         const tableData = reporteData.historial.map((item: any) => [
      item.fecha,
      item.usuario,
      item.estadoPrevio,
      item.estadoNuevo,
      item.comentario
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Fecha', 'Usuario', 'Estado Previo', 'Estado Nuevo', 'Comentario']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 50 }
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 3
      }
    });
  }
  
  // Guardar PDF
  const filename = `reporte-completo-${reporteData.id}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  return filename;
};

// MÃ©todo estÃ¡tico para exportar lista de reportes
PDFExport.exportReportsList = (exportData: any) => {
  const doc = new jsPDF();
  
  // Configurar fuente
  doc.setFont('helvetica');
  
  // TÃ­tulo principal
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text(exportData.title, 20, 20);
  
  // LÃ­nea separadora
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  let yPosition = 35;
  
  // InformaciÃ³n del reporte
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(exportData.subtitle, 20, yPosition);
  yPosition += 8;
  
  if (exportData.filters) {
    doc.text(exportData.filters, 20, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Lista de reportes
  if (exportData.data && exportData.data.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Lista de Reportes:', 20, yPosition);
    yPosition += 10;
    
    // Crear tabla con los reportes
         const tableData = exportData.data.map((item: any) => [
      item.ID,
      item.Titulo,
      item.Estado,
      item.Prioridad,
      item.Ubicacion,
      item.Reportado_por,
      item.Fecha_creacion
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['ID', 'Titulo', 'Estado', 'Prioridad', 'Ubicacion', 'Reportado por', 'Fecha']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 25 }, // ID
        1: { cellWidth: 40 }, // Titulo
        2: { cellWidth: 20 }, // Estado
        3: { cellWidth: 20 }, // Prioridad
        4: { cellWidth: 30 }, // Ubicacion
        5: { cellWidth: 25 }, // Reportado por
        6: { cellWidth: 25 }  // Fecha
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 3
      }
    });
    
    // Agregar pÃ¡gina adicional con detalles completos si hay muchos reportes
    if (exportData.data.length > 10) {
      doc.addPage();
      yPosition = 20;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Detalles Completos de Reportes:', 20, yPosition);
      yPosition += 10;
      
      // Tabla con todos los campos
             const detailedTableData = exportData.data.map((item: any) => [
        item.ID,
        item.Titulo,
        item.Descripcion,
        item.Estado,
        item.Prioridad,
        item.Ubicacion,
        item.Coordenadas,
        item.Reportado_por,
        item.Email,
        item.Fecha_creacion,
        item.Ultima_actualizacion,
        item.Fotos
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['ID', 'Titulo', 'Descripcion', 'Estado', 'Prioridad', 'Ubicacion', 'Coordenadas', 'Usuario', 'Email', 'Creacion', 'Actualizacion', 'Fotos']],
        body: detailedTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 8,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 15 }, // ID
          1: { cellWidth: 25 }, // Titulo
          2: { cellWidth: 30 }, // Descripcion
          3: { cellWidth: 15 }, // Estado
          4: { cellWidth: 15 }, // Prioridad
          5: { cellWidth: 25 }, // Ubicacion
          6: { cellWidth: 20 }, // Coordenadas
          7: { cellWidth: 20 }, // Usuario
          8: { cellWidth: 25 }, // Email
          9: { cellWidth: 20 }, // Creacion
          10: { cellWidth: 20 }, // Actualizacion
          11: { cellWidth: 10 }  // Fotos
        },
        styles: {
          overflow: 'linebreak',
          cellPadding: 2
        }
      });
    }
  } else {
    // Mensaje si no hay datos
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text('No hay reportes para exportar.', 20, yPosition);
  }
  
  // Guardar PDF
  const filename = `reportes_hydora_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  return filename;
};

export default PDFExport; 
