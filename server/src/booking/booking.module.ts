import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BookingRepository } from './repositories/booking.repository';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { PatientModule } from 'src/patient/patient.module';
import { PaymentRepository } from './repositories/payment.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { CentreModule } from 'src/centre/centre.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule.forRepository([
      BookingRepository,
      PaymentRepository,
      CentreAdminRepository,
    ]),
    PatientModule,
    CentreModule,
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
