import { Injectable, BadRequestException } from '@nestjs/common';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { PatientRepository } from '../repositories/patient.repository';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserRole } from 'src/database/entities/user.entity';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(userId: string, data: CreatePatientDto): Promise<Patient> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: UserRole.Receptionist,
    });
    if (user == null) {
      throw new BadRequestException(
        `Inavlid user role user id: ${userId}. User should be ${UserRole.Receptionist} to add patient.`,
      );
    }

    let patient = await this.patientRepository.findOne({
      where: {
        name: data.name,
        phone: data.phone,
        abhaId: data.abhaId,
      },
    });

    if (patient != null) {
      throw new BadRequestException(`Patient already exists.`);
    }

    patient = new Patient();
    patient.name = data.name;
    patient.age = data.age;
    patient.gender = data.gender;
    patient.phone = data.phone;
    patient.email = data.email;
    patient.address = data.address;
    patient.abhaId = data.abhaId;

    await this.patientRepository.save(patient, { reload: true });

    const updatedPatient = await this.patientRepository.generatePatientNumber(
      patient,
    );

    return updatedPatient;
  }

  async getById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ id });

    if (!patient) {
      throw new BadRequestException(`Patient with id ${id} not found.`);
    }

    return patient;
  }

  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    const patient = await this.getById(id);

    patient.age = data.age ?? patient.age;
    patient.gender = data.gender ?? patient.gender;
    patient.email = data.email ?? patient.email;
    patient.address = data.address ?? patient.address;
    patient.abhaId = data.abhaId ?? patient.abhaId;

    await this.patientRepository.save(patient);

    return patient;
  }
}
