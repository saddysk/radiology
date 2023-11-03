import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PatientRepository } from './repositories/patient.repository';
import { PatientService } from './services/patient.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreModule } from 'src/centre/centre.module';
import { PatientController } from './patient.controller';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';

@Module({
  imports: [
    DatabaseModule.forRepository([
      PatientRepository,
      UserRepository,
      CentreAdminRepository,
    ]),
    CentreModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
