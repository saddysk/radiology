import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CentreRepository } from './repositories/centre.repository';
import { CentreController } from './centre.controller';
import { CentreService } from './services/centre.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreAdminRepository } from './repositories/centre-admin.repository';
import { ExpenseController } from '../centre/expense.controller';
import { ExpenseService } from '../centre/services/expense.service';
import { ExpenseRepository } from './repositories/expense.repository';
import { RateListRepository } from './repositories/rate-list.repository';
import { RateListController } from './rate-list.controller';
import { RateListService } from './services/rate-list.service';
import { CentrePrRepository } from './repositories/centre-pr.repository';
import { DoctorCommissionRepository } from 'src/doctor-commission/repositories/doctor-commission.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule.forRepository([
      CentreRepository,
      UserRepository,
      CentreAdminRepository,
      CentrePrRepository,
      DoctorCommissionRepository,
      ExpenseRepository,
      RateListRepository,
    ]),
    AuthModule,
  ],
  controllers: [CentreController, ExpenseController, RateListController],
  providers: [CentreService, ExpenseService, RateListService],
  exports: [CentreService, ExpenseService],
})
export class CentreModule {}
