import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookingsService {
  private prisma = new PrismaClient();

  // Fungsi Create Booking (Disimpan dulu, kita pakai nanti)
  async create(createBookingDto: any) {
    // Validasi sederhana: Cek apakah slot masih kosong sebelum save
    const existing = await this.prisma.booking.findFirst({
      where: {
        courtId: createBookingDto.courtId,
        date: new Date(createBookingDto.date), // Pastikan format tanggal benar
        startTime: createBookingDto.startTime,
      },
    });

    if (existing) {
      throw new Error('Slot ini sudah dibooking orang lain!');
    }

    return this.prisma.booking.create({
      data: {
        courtId: createBookingDto.courtId,
        date: new Date(createBookingDto.date),
        startTime: createBookingDto.startTime,
        endTime: createBookingDto.startTime + 1, // Asumsi main 1 jam
        name: createBookingDto.name,
        status: 'PENDING', // Default pending
      },
    });
  }

  // --- LOGIKA UTAMA: CEK KETERSEDIAAN ---
  async checkAvailability(courtId: number, dateString: string) {
    // 1. Definisikan Jam Operasional (Misal: 08:00 - 22:00)
    const openHour = 8;
    const closeHour = 22;

    const allSlots: number[] = [];

    // Buat list semua jam dari 8 sampai 21
    for (let i = openHour; i < closeHour; i++) {
      allSlots.push(i);
    }

    // 2. Ambil booking yang SUDAH ADA di database untuk tanggal & lapangan tsb
    const bookedSlots = await this.prisma.booking.findMany({
      where: {
        courtId: courtId,
        date: new Date(dateString), // Filter tanggal
        status: { not: 'CANCELED' } // Jangan hitung yang sudah cancel
      },
      select: { startTime: true }, // Kita cuma butuh jam mulainya
    });

    // Ubah hasil database jadi array angka biasa [10, 14, 15]
    const bookedTimes = bookedSlots.map((b) => b.startTime);

    // 3. Filter: Jam Operasional DIKURANGI Jam Booked = Jam Available
    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

    return availableSlots; // Contoh return: [8, 9, 11, 12, ... dst]
  }
}