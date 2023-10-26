import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BookingRepository } from './repositories/booking.repository';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { PatientModule } from 'src/patient/patient.module';
import { PaymentRepository } from './repositories/payment.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';

@Module({
  imports: [
    DatabaseModule.forRepository([
      BookingRepository,
      UserRepository,
      PaymentRepository,
      CentreAdminRepository,
    ]),
    PatientModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
