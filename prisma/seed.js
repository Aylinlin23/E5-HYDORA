const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.reportHistory.deleteMany();
  await prisma.reportComment.deleteMany();
  await prisma.report.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Datos existentes eliminados');

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = [
    {
      name: 'Administrador',
      email: 'admin@hydora.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phone: '+52 55 1234 5678',
      address: 'Av. Reforma 123, CDMX'
    },
    {
      name: 'Autoridad Municipal',
      email: 'autoridad@hydora.com',
      password: hashedPassword,
      role: 'AUTHORITY',
      status: 'ACTIVE',
      emailVerified: true,
      phone: '+52 55 2345 6789',
      address: 'Plaza Mayor 456, CDMX'
    },
    {
      name: 'Juan Pérez',
      email: 'ciudadano@hydora.com',
      password: hashedPassword,
      role: 'CITIZEN',
      status: 'ACTIVE',
      emailVerified: true,
      phone: '+52 55 3456 7890',
      address: 'Condesa, CDMX'
    },
    {
      name: 'María González',
      email: 'maria@hydora.com',
      password: hashedPassword,
      role: 'CITIZEN',
      status: 'ACTIVE',
      emailVerified: true,
      phone: '+52 55 4567 8901',
      address: 'Roma Norte, CDMX'
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData
    });
    console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
  }

  // Crear algunos reportes de prueba
  const reports = [
    {
      title: 'Fuga de agua en la esquina de Reforma',
      description: 'Hay una fuga importante en la esquina de Reforma y Juárez. El agua está corriendo por la calle y ya está afectando el tránsito vehicular.',
      latitude: 19.4326,
      longitude: -99.1332,
      address: 'Reforma y Juárez, Centro, CDMX',
      status: 'PENDING',
      priority: 'HIGH',
      photos: 'https://via.placeholder.com/400x300/1F6FEB/FFFFFF?text=Foto+1,https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Foto+2',
      userId: (await prisma.user.findFirst({ where: { email: 'ciudadano@hydora.com' } })).id
    },
    {
      title: 'Desbordamiento de alcantarilla',
      description: 'La alcantarilla está desbordándose y hay agua estancada en la calle. Esto está causando problemas de tránsito.',
      latitude: 19.4000,
      longitude: -99.1500,
      address: 'Av. Insurgentes 123, CDMX',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      photos: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Foto+1',
      userId: (await prisma.user.findFirst({ where: { email: 'maria@hydora.com' } })).id
    },
    {
      title: 'Fuga menor en parque',
      description: 'Pequeña fuga en el sistema de riego del parque. No es urgente pero debería revisarse.',
      latitude: 19.4200,
      longitude: -99.1200,
      address: 'Parque Central, CDMX',
      status: 'RESOLVED',
      priority: 'LOW',
      photos: 'https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Foto+1',
      userId: (await prisma.user.findFirst({ where: { email: 'ciudadano@hydora.com' } })).id
    }
  ];

  for (const reportData of reports) {
    const report = await prisma.report.create({
      data: reportData
    });
    console.log(`✅ Reporte creado: ${report.title}`);
  }

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📋 Credenciales de prueba:');
  console.log('👤 Admin: admin@hydora.com / password123');
  console.log('👮 Autoridad: autoridad@hydora.com / password123');
  console.log('👥 Ciudadano: ciudadano@hydora.com / password123');
  console.log('👥 Ciudadano: maria@hydora.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 