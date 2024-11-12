import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.roles.upsert({
      where: { name: 'Admin' },
      update: {},
      create: {
        name: 'Admin',
      },
    });

    const user = await prisma.roles.upsert({
        where: { name: 'User' },
        update: {},
        create: {
          name: 'User',
        },
      });

    console.log('Seeding successful');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
