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
import { In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class DoctorCommissionService {
  constructor(
    private readonly doctorCommissionRepository: DoctorCommissionRepository,
    private readonly userRepository: UserRepository,
    private readonly centreRepository: CentreRepository,
  ) {}

  async add(
    userId: string,
    data: CreateDoctorCommissionDto,
  ): Promise<DoctorCommission[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: In([UserRole.Pr, UserRole.Admin]),
      },
    });
    if (user == null) {
      throw new BadRequestException(
        `Invalid access for user: ${user.id}, only ${UserRole.Pr} and ${UserRole.Admin} can onboard a doctor`,
      );
    }

    const doctor = await this.userRepository.findOne({
      where: {
        id: data.doctorId,
        role: UserRole.Doctor,
      },
    });
    if (doctor == null) {
      throw new BadRequestException(
        `Invalid user: ${data.doctorId}, the user should be a ${UserRole.Doctor}`,
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
    userId: string,
    data: UpdateDoctorCommissionDto,
  ): Promise<DoctorCommission> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: In([UserRole.Pr, UserRole.Admin]),
      },
    });
    if (user == null) {
      throw new BadRequestException(
        `Invalid access for user: ${user.id}, only ${UserRole.Pr} and ${UserRole.Admin} can onboard a doctor`,
      );
    }

    const commission = await this.doctorCommissionRepository.findOneBy({
      id: data.id,
    });

    if (commission == null) {
      throw new BadRequestException(
        `Doctor commission not found to update, for commission id: ${data.id}`,
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

  getById(id: string): Promise<DoctorCommission> {
    return this.doctorCommissionRepository.findOneBy({ id });
  }

  get(centreId: string, doctorId: string): Promise<DoctorCommission[]> {
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

  getAllDoctorsForCentre(centreId: string): Promise<DoctorCommission[]> {
    const currentDate = new Date();

    return this.doctorCommissionRepository.find({
      where: {
        centreId,
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      },
    });
  }

  getAllCentresForDoctor(doctorId: string): Promise<DoctorCommission[]> {
    const currentDate = new Date();

    return this.doctorCommissionRepository.find({
      where: {
        doctorId,
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

    if (commission.startDate) {
      doctorCommission.startDate = commission.startDate;
    }
    if (commission.endDate) {
      doctorCommission.endDate = commission.endDate;
    }

    return this.doctorCommissionRepository.save(doctorCommission, {
      reload: true,
    });
  }
}
