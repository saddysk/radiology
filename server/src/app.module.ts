import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { MailModule } from './mail/mail.module';
import { CentreModule } from './centre/centre.module';
import { DoctorCommissionModule } from './doctor-commission/doctor-commission.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    StorageModule,
    MailModule,
    CentreModule,
    DoctorCommissionModule,
  ],
})
export class AppModule {}
