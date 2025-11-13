const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'pereztapiaaylinestrella@gmail.com';
    const password = 'tracalas'; // La contraseña que usaste al registrarte
    
    console.log('🔍 Probando login con:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('');
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('✅ Usuario encontrado:');
    console.log(`- Nombre: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Rol: ${user.role}`);
    console.log(`- Estado: ${user.status}`);
    console.log('');
    
    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    console.log('🔐 Verificación de contraseña:');
    console.log(`- Contraseña proporcionada: ${password}`);
    console.log(`- Contraseña válida: ${isValidPassword ? '✅ SÍ' : '❌ NO'}`);
    
    if (isValidPassword) {
      console.log('');
      console.log('🎉 Login exitoso! El usuario puede hacer login con estas credenciales.');
    } else {
      console.log('');
      console.log('❌ La contraseña no coincide. Verifica la contraseña que usaste al registrarte.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 