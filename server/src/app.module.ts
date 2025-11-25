import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourtsModule } from './courts/courts.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [CourtsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
