const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:3000/api';

// Función para probar el flujo completo
async function testCompleteFlow() {
  try {
    console.log('🧪 Probando flujo completo del sistema...\n');

    // 1. Login
    console.log('1. 🔐 Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'ciudadano@hydora.com',
      password: 'password123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login falló: ' + loginResponse.data.message);
    }

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    console.log('✅ Login exitoso como:', user.name, `(${user.role})\n`);

    // 2. Obtener estadísticas iniciales
    console.log('2. 📊 Obteniendo estadísticas iniciales...');
    const initialStatsResponse = await axios.get(`${API_BASE_URL}/users/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (initialStatsResponse.data.success) {
      const initialStats = initialStatsResponse.data.data;
      console.log('✅ Estadísticas iniciales:', {
        totalReports: initialStats.totalReports,
        pendingReports: initialStats.pendingReports,
        resolvedReports: initialStats.resolvedReports,
        averageResponseTime: initialStats.averageResponseTime
      });
    }

    // 3. Crear un nuevo reporte
    console.log('\n3. 📝 Creando nuevo reporte...');
    const newReport = {
      title: 'Fuga de agua en calle principal',
      description: 'Hay una fuga importante en la calle principal que está causando problemas de tránsito y desperdicio de agua.',
      latitude: 19.4326,
      longitude: -99.1332,
      address: 'Calle Principal 123, CDMX',
      priority: 'HIGH',
      photos: 'https://via.placeholder.com/400x300/1F6FEB/FFFFFF?text=Foto+1'
    };

    const createReportResponse = await axios.post(`${API_BASE_URL}/reports`, newReport, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (createReportResponse.data.success) {
      console.log('✅ Reporte creado exitosamente:', createReportResponse.data.message);
      console.log('📋 ID del reporte:', createReportResponse.data.report.id);
    } else {
      throw new Error('Error creando reporte: ' + createReportResponse.data.message);
    }

    // 4. Obtener estadísticas actualizadas
    console.log('\n4. 📊 Obteniendo estadísticas actualizadas...');
    const updatedStatsResponse = await axios.get(`${API_BASE_URL}/users/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (updatedStatsResponse.data.success) {
      const updatedStats = updatedStatsResponse.data.data;
      console.log('✅ Estadísticas actualizadas:', {
        totalReports: updatedStats.totalReports,
        pendingReports: updatedStats.pendingReports,
        resolvedReports: updatedStats.resolvedReports,
        averageResponseTime: updatedStats.averageResponseTime
      });
    }

    // 5. Obtener reportes del usuario
    console.log('\n5. 📋 Obteniendo reportes del usuario...');
    const userReportsResponse = await axios.get(`${API_BASE_URL}/reports/my-reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (userReportsResponse.data.success) {
      const reports = userReportsResponse.data.data.reports;
      console.log(`✅ Reportes obtenidos: ${reports.length} reportes`);
      console.log('📋 Lista de reportes:');
      reports.forEach((report, index) => {
        console.log(`   ${index + 1}. ${report.title} - ${report.status} (${report.priority})`);
      });
    }

    // 6. Probar cambio de estado (simular como autoridad)
    console.log('\n6. 🔄 Probando cambio de estado...');
    
    // Primero hacer login como autoridad
    const authorityLoginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'autoridad@hydora.com',
      password: 'password123'
    });

    if (authorityLoginResponse.data.success) {
      const authorityToken = authorityLoginResponse.data.data.token;
      const reportId = createReportResponse.data.report.id;

      // Cambiar estado del reporte
      const updateStatusResponse = await axios.patch(`${API_BASE_URL}/reports/${reportId}/status`, {
        status: 'IN_PROGRESS',
        reason: 'Equipo técnico asignado para revisión'
      }, {
        headers: { 'Authorization': `Bearer ${authorityToken}` }
      });

      if (updateStatusResponse.data.success) {
        console.log('✅ Estado actualizado exitosamente:', updateStatusResponse.data.message);
      } else {
        console.log('⚠️ Error actualizando estado:', updateStatusResponse.data.message);
      }
    }

    console.log('\n🎉 ¡Flujo completo probado exitosamente!');

  } catch (error) {
    console.error('❌ Error en el flujo:', error.response?.data || error.message);
  }
}

// Ejecutar la prueba
testCompleteFlow(); 