import { PickType } from '@nestjs/swagger';
import {
  UUIDField,
  StringField,
  NumberField,
  ObjectFieldOptional,
  StringFieldOptional,
  NumberFieldOptional,
  DateField,
  UUIDFieldOptional,
} from 'libs/decorators';
import { Booking } from 'src/database/entities/booking.entity';
import { CreatePatientDto, PatientDto } from 'src/patient/dto/patient.dto';

export class BookingDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

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

  @NumberField()
  amount: number;

  @NumberFieldOptional()
  discount?: number;

  @StringFieldOptional()
  remark?: string;

  @StringFieldOptional()
  extraCharge?: string;

  @StringField()
  paymentType: string;

  @ObjectFieldOptional(() => PatientDto)
  patient: PatientDto;

  constructor(booking?: Booking) {
    if (booking == null) {
      return;
    }

    this.id = booking.id;
    this.createdAt = booking.createdAt;
    this.centreId = booking.centreId;
    this.patientId = booking.patientId;
    this.submittedBy = booking.submittedBy;
    this.consultant = booking.consultant;
    this.modality = booking.modality;
    this.investigation = booking.investigation;
    this.amount = booking.amount;
    this.discount = booking.discount;
    this.remark = booking.remark;
    this.extraCharge = booking.extraCharge;
    this.paymentType = booking.paymentType;
  }

  static async toDto(booking: Booking) {
    const dto = new BookingDto(booking);

    dto.patient = new PatientDto(await booking.patient);

    return dto;
  }
}

export class CreateBookingDto extends PickType(BookingDto, [
  'centreId',
  'consultant',
  'modality',
  'investigation',
  'amount',
  'discount',
  'remark',
  'extraCharge',
  'paymentType',
]) {
  @UUIDFieldOptional()
  patientId?: string;

  @ObjectFieldOptional(() => CreatePatientDto)
  patient?: CreatePatientDto;
}
