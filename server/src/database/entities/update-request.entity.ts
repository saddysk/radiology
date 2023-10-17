import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Expense } from './expense.entity';
import { Booking } from './booking.entity';

export enum RequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum RequestType {
  Expense = 'expense',
  Booking = 'booking',
}

@Entity()
export class UpdateRequest extends AbstractEntity {
  @Column({ type: 'uuid' })
  centreId: string;

  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @Column({ type: 'uuid' })
  requestedBy: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.Pending,
  })
  status: RequestStatus;

  @Column({ type: 'json', nullable: true })
  expenseData?: Expense;

  @Column({ type: 'json', nullable: true })
  bookingData?: Booking;
}
