import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // API untuk mengecek ketersediaan
  // Contoh URL: GET /bookings/check?courtId=1&date=2024-11-25
  @Get('check')
  async checkAvailability(
    @Query('courtId') courtId: string,
    @Query('date') date: string,
  ) {
    if (!courtId || !date) {
      throw new BadRequestException('CourtId dan Date wajib diisi!');
    }
    return this.bookingsService.checkAvailability(+courtId, date);
  }

  // API untuk membuat booking baru
  @Post()
  create(@Body() createBookingDto: any) {
    return this.bookingsService.create(createBookingDto);
  }
}