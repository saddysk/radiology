import { PickType } from '@nestjs/swagger';
import {
  UUIDField,
  StringField,
  NumberField,
  DateField,
  EmailFieldOptional,
  StringFieldOptional,
  ObjectFieldOptional,
} from 'libs/decorators';
import { BookingDto } from 'src/booking/dto/booking.dto';
import { Patient } from 'src/database/entities/patient.entity';

export class PatientDto {
  @UUIDField()
  id: string;

  @StringField()
  patientNumber: string;

  @DateField()
  createdAt: Date;

  @StringField()
  name: string;

  @NumberField()
  age: number;

  @StringField()
  gender: string;

  @StringField()
  phone: string;

  @EmailFieldOptional()
  email?: string;

  @StringFieldOptional()
  address?: string;

  @StringFieldOptional()
  abhaId?: string;

  @ObjectFieldOptional(() => BookingDto, {
    isArray: true,
  })
  booking?: BookingDto[];

  constructor(patient?: Patient) {
    if (patient == null) {
      return;
    }

    this.id = patient.id;
    this.patientNumber = patient.patientNumber;
    this.createdAt = patient.createdAt;
    this.name = patient.name;
    this.age = patient.age;
    this.gender = patient.gender;
    this.phone = patient.phone;
    this.email = patient.email;
    this.address = patient.address;
    this.abhaId = patient.abhaId;
  }

  static async toDto(patient: Patient) {
    const dto = new PatientDto(patient);

    const bookings = await patient.booking;
    dto.booking = bookings?.map((booking) => new BookingDto(booking));

    return dto;
  }
}

export class CreatePatientDto extends PickType(PatientDto, [
  'name',
  'age',
  'gender',
  'phone',
  'email',
  'address',
  'abhaId',
]) {}

export class UpdatePatientDto extends PickType(CreatePatientDto, [
  'age',
  'gender',
  'email',
  'address',
  'abhaId',
]) {}
