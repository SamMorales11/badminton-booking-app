import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding data...');


  await prisma.booking.deleteMany(); // Hapus booking dulu karena ada relasi
  await prisma.court.deleteMany();

  // Buat Data Lapangan Dummy
  const courtA = await prisma.court.create({
    data: {
      name: 'Lapangan A (Karpet - Pro)',
      pricePerHour: 80000,
    },
  });

  const courtB = await prisma.court.create({
    data: {
      name: 'Lapangan B (Lantai Kayu)',
      pricePerHour: 60000,
    },
  });

  const courtC = await prisma.court.create({
    data: {
      name: 'Lapangan C (Semen - Standar)',
      pricePerHour: 40000,
    },
  });

  console.log(`✅ Berhasil membuat lapangan:`);
  console.log({ courtA, courtB, courtC });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });