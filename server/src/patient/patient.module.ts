import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PatientRepository } from './repositories/patient.repository';
import { PatientService } from './services/patient.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreModule } from 'src/centre/centre.module';

@Module({
  imports: [
    DatabaseModule.forRepository([PatientRepository, UserRepository]),
    CentreModule,
  ],
  controllers: [],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
