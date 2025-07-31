const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Datos existentes eliminados');

  // Crear usuarios de prueba
  const users = [
    {
      email: 'admin@hydora.com',
      password: 'admin123',
      name: 'Administrador del Sistema',
      role: 'ADMIN'
    },
    {
      email: 'autoridad@hydora.com',
      password: 'autoridad123',
      name: 'María González - Autoridad',
      role: 'AUTHORITY'
    },
    {
      email: 'ciudadano@hydora.com',
      password: 'ciudadano123',
      name: 'Juan Pérez - Ciudadano',
      role: 'CITIZEN'
    },
    {
      email: 'ana@ejemplo.com',
      password: 'ana123',
      name: 'Ana Martínez',
      role: 'CITIZEN'
    }
  ];

  const createdUsers = [];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role
      }
    });

    createdUsers.push({
      ...user,
      password: userData.password // Guardar contraseña original para mostrar
    });

    console.log(`✅ Usuario creado: ${user.name} (${user.email}) - Contraseña: ${userData.password}`);
  }

  // Crear reportes de ejemplo
  const sampleReports = [
    {
      title: 'Fuga de agua en la esquina de Reforma',
      description: 'Hay una fuga importante en la esquina de Av. Reforma y Insurgentes. El agua está saliendo por una grieta en la acera.',
      latitude: 19.4326,
      longitude: -99.1332,
      address: 'Av. Reforma 123, Ciudad de México',
      photos: 'https://ejemplo.com/foto1.jpg,https://ejemplo.com/foto2.jpg',
      priority: 'HIGH',
      status: 'PENDING'
    },
    {
      title: 'Desbordamiento de alcantarilla',
      description: 'La alcantarilla en la calle Juárez está desbordándose y el agua está inundando la calle.',
      latitude: 19.4342,
      longitude: -99.1392,
      address: 'Calle Juárez 45, Ciudad de México',
      photos: 'https://ejemplo.com/foto3.jpg',
      priority: 'URGENT',
      status: 'IN_PROGRESS'
    },
    {
      title: 'Fuga menor en parque',
      description: 'Pequeña fuga en el sistema de riego del parque central.',
      latitude: 19.4285,
      longitude: -99.1276,
      address: 'Parque Central, Ciudad de México',
      photos: '',
      priority: 'LOW',
      status: 'RESOLVED'
    }
  ];

  for (let i = 0; i < sampleReports.length; i++) {
    const reportData = sampleReports[i];
    const userId = createdUsers[i % createdUsers.length].id; // Distribuir reportes entre usuarios

    const report = await prisma.report.create({
      data: {
        ...reportData,
        userId: userId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log(`✅ Reporte creado: ${report.title} - Por: ${report.user.name}`);
  }

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Usuarios de prueba creados:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  createdUsers.forEach(user => {
    console.log(`👤 ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔑 Contraseña: ${user.password}`);
    console.log(`   👑 Rol: ${user.role}`);
    console.log('');
  });

  console.log('🚀 Para probar la API:');
  console.log('1. Inicia el servidor: npm run dev');
  console.log('2. Ve a: http://localhost:3000/api-docs');
  console.log('3. Usa las credenciales de arriba para hacer login');
  console.log('4. Prueba crear, ver y actualizar reportes');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 