import { BadRequestException, Injectable } from '@nestjs/common';
import { DoctorCommissionRepository } from '../repositories/doctor-commission.repository';
import { DoctorCommission } from 'src/database/entities/doctor-commission.entity';
import {
  CommissionDto,
  CreateDoctorCommissionDto,
  UpdateDoctorCommissionDto,
} from '../dto/doctor-commission.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserRole } from 'src/database/enums/user.enum';
import { CentreRepository } from 'src/centre/repositories/centre.repository';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class DoctorCommissionService {
  constructor(
    private readonly doctorCommissionRepository: DoctorCommissionRepository,
    private readonly userRepository: UserRepository,
    private readonly centreRepository: CentreRepository,
  ) {}

  async add(
    doctorId: string,
    data: CreateDoctorCommissionDto,
  ): Promise<DoctorCommission[]> {
    const doctor = await this.userRepository.findOne({
      where: {
        id: doctorId,
        role: UserRole.Doctor,
      },
    });

    if (doctor == null) {
      throw new BadRequestException(
        `Invalid user: ${doctorId}, the user role should be ${UserRole.Doctor}`,
      );
    }

    const centre = await this.centreRepository.findOneBy({ id: data.centreId });

    if (centre == null) {
      throw new BadRequestException(`Invalid centre: ${data.centreId}`);
    }

    const doctorCommission = new DoctorCommission();
    doctorCommission.doctorId = doctor.id;
    doctorCommission.centreId = centre.id;

    const commissions = await Promise.all(
      data.commissions.map((commission) =>
        this.addCommissions(doctorCommission, commission),
      ),
    );

    return commissions;
  }

  async update(
    doctorId: string,
    data: UpdateDoctorCommissionDto,
  ): Promise<DoctorCommission> {
    const commission = await this.doctorCommissionRepository.findOne({
      where: {
        id: data.id,
        doctorId,
      },
    });

    if (commission == null) {
      throw new BadRequestException(
        `Doctor commission not found to update, for commission id: ${data.id}, doctor id: ${doctorId}`,
      );
    }

    const newCommission = new DoctorCommission();
    newCommission.doctorId = commission.doctorId;
    newCommission.centreId = commission.centreId;

    const newCommissionSave$ = this.addCommissions(newCommission, {
      modality: commission.modality,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate && data.endDate,
    });

    commission.endDate = data.startDate;

    const existingCommissionUpdate$ = this.doctorCommissionRepository.update(
      { id: data.id },
      commission,
    );

    await Promise.all([newCommissionSave$, existingCommissionUpdate$]);

    return newCommission;
  }

  get(id: string): Promise<DoctorCommission> {
    return this.doctorCommissionRepository.findOneBy({ id });
  }

  getAll(centreId: string, doctorId: string): Promise<DoctorCommission[]> {
    const currentDate = new Date();

    return this.doctorCommissionRepository.find({
      where: {
        doctorId,
        centreId,
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      },
    });
  }

  private addCommissions(
    doctorCommission: DoctorCommission,
    commission: CommissionDto,
  ): Promise<DoctorCommission> {
    doctorCommission.modality = commission.modality;
    doctorCommission.amount = commission.amount;
    doctorCommission.startDate = commission.startDate;

    if (commission.endDate) {
      doctorCommission.endDate = commission.endDate;
    }

    return this.doctorCommissionRepository.save(doctorCommission, {
      reload: true,
    });
  }
}
