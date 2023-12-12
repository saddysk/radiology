import { OmitType, PickType } from '@nestjs/swagger';
import {
  UUIDField,
  StringField,
  ObjectFieldOptional,
  StringFieldOptional,
  DateField,
  ObjectField,
  NumberFieldOptional,
  EnumField,
} from 'libs/decorators';
import { Booking, IBookingRecord } from 'src/database/entities/booking.entity';
import { CreatePatientDto, PatientDto } from 'src/patient/dto/patient.dto';
import { BookingPaymentDto, PaymentDto } from './payment.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { StorageFileTypes } from 'src/storage/services/storage.service';
import { CentreService } from 'src/centre/services/centre.service';

export class BookingRecordDto {
  @StringField()
  url: string;

  @EnumField(() => StorageFileTypes)
  type: StorageFileTypes;

  constructor(record?: IBookingRecord) {
    if (record == null) {
      return;
    }

    this.url = record.url;
    this.type = record.type;
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

  @StringFieldOptional()
  smkId?: string;

  @UUIDField()
  submittedBy: string;

  @UUIDField()
  consultant: string;

  @StringField()
  consultantName: string;

  @StringField()
  centreName: string;

  @StringField()
  modality: string;

  @StringField()
  investigation: string;

  @StringFieldOptional()
  remark?: string;

  @ObjectFieldOptional(() => BookingRecordDto, {
    isArray: true,
  })
  records?: BookingRecordDto[];

  @NumberFieldOptional()
  referralAmount?: number;

  @NumberFieldOptional()
  totalAmount?: number;

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
    this.referralAmount = booking.referralAmount;
    this.totalAmount = booking.totalAmount;

    if (booking.records) {
      this.records = booking.records.map(
        (record) => new BookingRecordDto(record),
      );
    }
  }

  static async toDto(
    booking: Booking,
    authService?: AuthService,
    centreService?: CentreService,
  ) {
    const dto = new BookingDto(booking);

    dto.patient = new PatientDto(await booking.patient);

    const payments = await booking.payment;
    dto.payment = await Promise.all(
      payments.map((payment) => new PaymentDto(payment)),
    );

    if (authService) {
      const consultant = await authService.get(dto.consultant);
      dto.consultantName = consultant.name;

      const user = await authService.get(dto.submittedBy);
      dto.submittedBy = user.name;
    }
    if (centreService) {
      const centre = await centreService.getById(booking.centreId);
      dto.centreName = centre.name;
    }

    return dto;
  }
}

export class CreateBookingDto extends PickType(BookingDto, [
  'smkId',
  'centreId',
  'consultant',
  'modality',
  'investigation',
  'remark',
  'referralAmount',
  'totalAmount',
]) {
  @StringFieldOptional()
  patientNumber?: string;

  @ObjectFieldOptional(() => CreatePatientDto)
  patient?: CreatePatientDto;

  @ObjectField(() => BookingPaymentDto)
  payment: BookingPaymentDto;

  @StringFieldOptional()
  recordFile?: string;
}

export class UpdateBookingDto extends OmitType(BookingDto, [
  'patient',
  'payment',
  'consultantName',
  'centreName',
]) {}

export class UploadRecordDto extends PickType(BookingDto, ['id']) {
  @StringFieldOptional()
  recordFile?: string;
}
