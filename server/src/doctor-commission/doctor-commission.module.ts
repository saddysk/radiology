import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DoctorCommissionController } from './doctor-commission.controller';
import { DoctorCommissionRepository } from './repositories/doctor-commission.repository';
import { DoctorCommissionService } from './services/doctor-commission.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreRepository } from 'src/centre/repositories/centre.repository';

@Module({
  imports: [
    DatabaseModule.forRepository([
      DoctorCommissionRepository,
      UserRepository,
      CentreRepository,
    ]),
  ],
  controllers: [DoctorCommissionController],
  providers: [DoctorCommissionService],
})
export class DoctorCommissionModule {}
