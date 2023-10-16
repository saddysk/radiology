import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PatientRepository } from './repositories/patient.repository';
import { PatientService } from './services/patient.service';
import { UserRepository } from 'src/auth/repositories/user.repository';

@Module({
  imports: [DatabaseModule.forRepository([PatientRepository, UserRepository])],
  controllers: [],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
