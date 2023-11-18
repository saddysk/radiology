import { BadRequestException } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Booking } from 'src/database/entities/booking.entity';
import { Expense } from 'src/database/entities/expense.entity';
import {
  RequestStatus,
  UpdateRequest,
} from 'src/database/entities/update-request.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(UpdateRequest)
export class UpdateRequestRepository extends AbstractRepository<UpdateRequest> {
  async upadteStatus(
    id: string,
    status: RequestStatus,
    approvedData?: Expense | Booking,
  ): Promise<UpdateRequest> {
    const updateRequest = await this.findOneBy({ id });
    if (updateRequest == null) {
      throw new BadRequestException(`Update request not found with id: ${id}`);
    }

    updateRequest.status = status;
    updateRequest.approvedData = approvedData;

    await this.update(updateRequest.id, {
      status: updateRequest.status,
      approvedData: updateRequest.approvedData,
    });

    return updateRequest;
  }
}
