import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { CentreModule } from './centre/centre.module';
import { DoctorCommissionModule } from './doctor-commission/doctor-commission.module';
import { PatientModule } from './patient/patient.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    StorageModule,
    CentreModule,
    DoctorCommissionModule,
    PatientModule,
    BookingModule,
  ],
})
export class AppModule {}
