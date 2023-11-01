import { PickType } from '@nestjs/swagger';
import {
  UUIDField,
  StringField,
  NumberField,
  DateField,
  StringFieldOptional,
  NumberFieldOptional,
  ObjectField,
} from 'libs/decorators';
import { Payment } from 'src/database/entities/payment.entity';

export class PaymentDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @UUIDField()
  bookingId: string;

  @NumberField()
  amount: number;

  @NumberFieldOptional()
  discount?: number;

  @StringFieldOptional()
  extraCharge?: string;

  @StringField()
  paymentType: string;

  constructor(payment?: Payment) {
    if (payment == null) {
      return;
    }

    this.id = payment.id;
    this.createdAt = payment.createdAt;
    this.bookingId = payment.bookingId;
    this.amount = payment.amount;
    this.discount = payment.discount;
    this.extraCharge = payment.extraCharge;
    this.paymentType = payment.paymentType;
  }
}

export class CreatePaymentDto extends PickType(PaymentDto, [
  'amount',
  'discount',
  'extraCharge',
  'paymentType',
]) {}

export class BookingPaymentsDto extends PickType(PaymentDto, [
  'amount',
  'paymentType',
]) {}

export class BookingPaymentDto extends PickType(PaymentDto, [
  'discount',
  'extraCharge',
]) {
  @ObjectField(() => BookingPaymentsDto, {
    isArray: true,
  })
  payments: BookingPaymentsDto[];
}
