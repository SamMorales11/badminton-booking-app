import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CourtsService {
  // Kita inisialisasi Prisma Client langsung di sini
  private prisma = new PrismaClient();

  // Fungsi untuk mengambil semua data lapangan
  async findAll() {
    return this.prisma.court.findMany();
  }

  // Fungsi untuk mengambil satu lapangan by ID (Nanti dipakai saat booking)
  async findOne(id: number) {
    return this.prisma.court.findUnique({
      where: { id },
    });
  }
}