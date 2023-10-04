import { PickType } from '@nestjs/swagger';
import {
  DateField,
  DateFieldOptional,
  NumberField,
  ObjectField,
  StringField,
  UUIDField,
} from 'libs/decorators';
import { DoctorCommission } from 'src/database/entities/doctor-commission.entity';

export class DoctorCommissionDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @UUIDField()
  doctorId: string;

  @UUIDField()
  centreId: string;

  @StringField()
  modality: string;

  @NumberField()
  amount: number;

  @DateField()
  startDate: Date;

  @DateFieldOptional()
  endDate?: Date;

  constructor(doctorCommission?: DoctorCommission) {
    if (doctorCommission == null) {
      return;
    }

    this.id = doctorCommission.id;
    this.createdAt = doctorCommission.createdAt;
    this.updatedAt = doctorCommission.updatedAt;
    this.doctorId = doctorCommission.doctorId;
    this.centreId = doctorCommission.centreId;
    this.modality = doctorCommission.modality;
    this.amount = doctorCommission.amount;
    this.startDate = doctorCommission.startDate;
    this.endDate = doctorCommission.endDate;
  }
}

export class CommissionDto extends PickType(DoctorCommissionDto, [
  'modality',
  'amount',
  'startDate',
  'endDate',
]) {}

export class CreateDoctorCommissionDto extends PickType(DoctorCommissionDto, [
  'centreId',
]) {
  @ObjectField(() => CommissionDto, { isArray: true })
  commissions: CommissionDto[];
}

export class UpdateDoctorCommissionDto extends PickType(DoctorCommissionDto, [
  'id',
  'amount',
  'startDate',
  'endDate',
]) {}
