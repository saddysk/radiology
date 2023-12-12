import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UpdateRequestRepository } from './repositories/update-request.repository';
import { UpdateRequestController } from './update-request.controller';
import { UpdateRequestService } from './services/update-request.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { CentreModule } from 'src/centre/centre.module';
import { BookingModule } from 'src/booking/booking.module';
import { BookingRepository } from 'src/booking/repositories/booking.repository';
import { ExpenseRepository } from 'src/centre/repositories/expense.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule.forRepository([
      UpdateRequestRepository,
      UserRepository,
      CentreAdminRepository,
      ExpenseRepository,
      BookingRepository,
    ]),
    CentreModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [UpdateRequestController],
  providers: [UpdateRequestService],
})
export class UpdateRequestModule {}
