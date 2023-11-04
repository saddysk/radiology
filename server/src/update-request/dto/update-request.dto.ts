import { PickType } from '@nestjs/swagger';
import {
  DateField,
  EnumField,
  ObjectFieldOptional,
  UUIDField,
} from 'libs/decorators';
import { BookingDto, UpdateBookingDto } from 'src/booking/dto/booking.dto';
import { ExpenseDto } from 'src/centre/dto/expense.dto';
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

  @ObjectFieldOptional(() => ExpenseDto)
  expenseData?: ExpenseDto;

  @ObjectFieldOptional(() => UpdateBookingDto)
  bookingData?: UpdateBookingDto;

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
    this.expenseData = new ExpenseDto(updateRequest.expenseData);
    this.bookingData = new BookingDto(updateRequest.bookingData);
  }
}

export class CreateUpdateRequestDto extends PickType(UpdateRequestDto, [
  'type',
  'expenseData',
  'bookingData',
]) {}
