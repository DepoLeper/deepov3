import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with admin user...');

  // --- FONTOS: Mielőtt futtatnád, írd át ezeket az adatokat! ---
  const adminEmail = 'vogl.gergo@t-depo.hu';
  const adminPassword = 'changeme'; // Válassz egy erős, ideiglenes jelszót
  // ---------------------------------------------------------

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('A jelszónak legalább 8 karakter hosszúnak kell lennie.');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(), // Az admin emailjét automatikusan megerősítettnek tekintjük
    },
  });

  console.log(`Admin user ${adminUser.email} has been created/updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 