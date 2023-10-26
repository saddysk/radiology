import { OmitType, PickType } from '@nestjs/swagger';
import {
  UUIDField,
  StringField,
  ObjectFieldOptional,
  StringFieldOptional,
  DateField,
  UUIDFieldOptional,
  ObjectField,
} from 'libs/decorators';
import { Booking } from 'src/database/entities/booking.entity';
import { IBookingRecord } from 'src/database/interfaces/booking.interface';
import { CreatePatientDto, PatientDto } from 'src/patient/dto/patient.dto';
import { CreatePaymentDto, PaymentDto } from './payment.dto';

export class BookingRecordDto {
  @StringField()
  type: string;

  @StringField()
  url: string;

  constructor(record?: IBookingRecord) {
    if (record == null) {
      return;
    }

    this.type = record.type;
    this.url = record.url;
  }
}

export class BookingDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @UUIDField()
  centreId: string;

  @UUIDField()
  patientId: string;

  @UUIDField()
  submittedBy: string;

  @UUIDField()
  consultant: string;

  @StringField()
  modality: string;

  @StringField()
  investigation: string;

  @StringFieldOptional()
  remark?: string;

  @ObjectFieldOptional(() => BookingRecordDto)
  record?: BookingRecordDto;

  @ObjectFieldOptional(() => PaymentDto, {
    isArray: true,
  })
  payment?: PaymentDto[];

  @ObjectFieldOptional(() => PatientDto)
  patient?: PatientDto;

  constructor(booking?: Booking) {
    if (booking == null) {
      return;
    }

    this.id = booking.id;
    this.createdAt = booking.createdAt;
    this.updatedAt = booking.updatedAt;
    this.centreId = booking.centreId;
    this.patientId = booking.patientId;
    this.submittedBy = booking.submittedBy;
    this.consultant = booking.consultant;
    this.modality = booking.modality;
    this.investigation = booking.investigation;
    this.remark = booking.remark;
    this.record = new BookingRecordDto(booking.record);
  }

  static async toDto(booking: Booking) {
    const dto = new BookingDto(booking);

    dto.patient = new PatientDto(await booking.patient);

    const payments = await booking.payment;
    dto.payment = await Promise.all(
      payments.map((payment) => new PaymentDto(payment)),
    );

    return dto;
  }
}

export class CreateBookingDto extends PickType(BookingDto, [
  'centreId',
  'consultant',
  'modality',
  'investigation',
  'remark',
]) {
  @UUIDFieldOptional()
  patientId?: string;

  @ObjectFieldOptional(() => CreatePatientDto)
  patient?: CreatePatientDto;

  @ObjectField(() => CreatePaymentDto, {
    isArray: true,
  })
  payment: CreatePaymentDto[];
}

export class UpdateBookingDto extends OmitType(BookingDto, [
  'patient',
  'payment',
]) {}
