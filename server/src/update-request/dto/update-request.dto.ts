import { PickType } from '@nestjs/swagger';
import {
  DateField,
  EnumField,
  ObjectFieldOptional,
  UUIDField,
} from 'libs/decorators';
import { BookingDto, UpdateBookingDto } from 'src/booking/dto/booking.dto';
import { ExpenseDto } from 'src/centre/dto/expense.dto';
import { Expense } from 'src/database/entities/expense.entity';
import {
  RequestStatus,
  RequestType,
  UpdateRequest,
} from 'src/database/entities/update-request.entity';

export class UpdateRequestDto {
  @UUIDField()
  id: string;

  @UUIDField()
  centreId: string;

  @DateField()
  createdAt: Date;

  @UUIDField()
  requestedBy: string;

  @EnumField(() => RequestType)
  type: RequestType;

  @EnumField(() => RequestStatus)
  status: RequestStatus;

  @ObjectFieldOptional(() => ExpenseDto || UpdateBookingDto)
  requestData?: ExpenseDto | UpdateBookingDto;

  @ObjectFieldOptional(() => ExpenseDto || BookingDto)
  pastData?: ExpenseDto | BookingDto;

  constructor(updateRequest?: UpdateRequest) {
    if (updateRequest == null) {
      return;
    }

    this.id = updateRequest.id;
    this.centreId = updateRequest.centreId;
    this.createdAt = updateRequest.createdAt;
    this.requestedBy = updateRequest.requestedBy;
    this.type = updateRequest.type;
    this.status = updateRequest.status;

    this.requestData =
      updateRequest.requestData instanceof Expense
        ? new ExpenseDto(updateRequest.requestData)
        : new BookingDto(updateRequest.requestData);

    if (updateRequest.pastData) {
      this.pastData =
        updateRequest.pastData instanceof Expense
          ? new ExpenseDto(updateRequest.pastData)
          : new BookingDto(updateRequest.pastData);
    }
  }
}

export class CreateUpdateRequestDto extends PickType(UpdateRequestDto, [
  'type',
  'requestData',
]) {}
