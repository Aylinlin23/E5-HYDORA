const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function activateAllUsers() {
  try {
    console.log('🔧 Activando todos los usuarios pendientes de verificación...');

    // Buscar usuarios pendientes de verificación
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING_VERIFICATION'
      }
    });

    console.log(`📋 Encontrados ${pendingUsers.length} usuarios pendientes de verificación`);

    // Activar todos los usuarios pendientes
    for (const user of pendingUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'ACTIVE',
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      });
      console.log(`✅ Usuario ${user.email} activado`);
    }

    console.log('🎉 Todos los usuarios han sido activados exitosamente!');
    console.log('\n📋 Ahora puedes hacer login con cualquier usuario registrado');

  } catch (error) {
    console.error('❌ Error activando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

activateAllUsers(); 