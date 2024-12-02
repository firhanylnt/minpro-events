import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Roles
    await prisma.roles.upsert({
      where: { name: 'Admin' },
      create: { name: 'Admin' },
      update: {},
    });

    await prisma.roles.upsert({
      where: { name: 'User' },
      create: { name: 'User' },
      update: {},
    });

    // Event Types
    const eventTypes = ['with seat', 'without seat'];
    for (const type of eventTypes) {
      await prisma.event_type.upsert({
        where: { name: type },
        create: { name: type },
        update: {},
      });
    }

    // Event Categories
    const eventCategories = ['Concert', 'Art', 'Automotive'];
    for (const category of eventCategories) {
      await prisma.event_category.upsert({
        where: { name: category },
        create: { name: category },
        update: {},
      });
    }

    // Countries
    await prisma.countries.upsert({
      where: { name: 'Indonesia' },
      create: { name: 'Indonesia' },
      update: {},
    });

    // Regions
    const regions = [
      { region_name: 'DKI Jakarta', country_id: 1 },
      { region_name: 'Jawa Barat', country_id: 1 },
      { region_name: 'Banten', country_id: 1 },
    ];
    for (const region of regions) {
      await prisma.regions.upsert({
        where: { region_name: region.region_name },
        create: region,
        update: {},
      });
    }

    // Cities
    const cities = [
      { city_name: 'Jakarta Selatan', region_id: 1 },
      { city_name: 'Depok', region_id: 2 },
      { city_name: 'Tangerang', region_id: 3 },
    ];
    for (const city of cities) {
      await prisma.cities.upsert({
        where: { city_name: city.city_name },
        create: city,
        update: {},
      });
    }

    // Payment Methods
    const paymentMethods = [
      { name: 'Credit/Debit Card', admin_fee: 2000 },
      { name: 'Bank Transfer', admin_fee: 1500 },
      { name: 'QRIS', admin_fee: 1000 },
    ];
    for (const method of paymentMethods) {
      await prisma.payment_method.upsert({
        where: { name: method.name },
        create: method,
        update: {},
      });
    }

    console.log('Seeding successful');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
