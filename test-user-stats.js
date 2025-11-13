const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:3000/api';

// Función para probar el endpoint de estadísticas del usuario
async function testUserStats() {
  try {
    console.log('🧪 Probando endpoint de estadísticas del usuario...\n');

    // 1. Primero hacer login para obtener un token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'ciudadano@hydora.com',
      password: 'password123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login falló: ' + loginResponse.data.message);
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login exitoso\n');

    // 2. Probar el endpoint de estadísticas
    console.log('2. Obteniendo estadísticas del usuario...');
    const statsResponse = await axios.get(`${API_BASE_URL}/users/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (statsResponse.data.success) {
      console.log('✅ Estadísticas obtenidas exitosamente:');
      console.log('📊 Datos recibidos:', JSON.stringify(statsResponse.data.data, null, 2));
    } else {
      console.log('❌ Error obteniendo estadísticas:', statsResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
  }
}

// Ejecutar la prueba
testUserStats(); 