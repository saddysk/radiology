import { Injectable, BadRequestException } from '@nestjs/common';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { PatientRepository } from '../repositories/patient.repository';
import { CentreService } from 'src/centre/services/centre.service';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly centreService: CentreService,
    private readonly centreAdminRepository: CentreAdminRepository,
  ) {}

  async create(
    userId: string,
    centreId: string,
    data: CreatePatientDto,
  ): Promise<Patient> {
    const centre = await this.centreService.get(userId, centreId);

    if (centre == null) {
      throw new BadRequestException(`Invalid centre.`);
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
    patient.centreId = centre.id;
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

  async getByPatientNumber(patientNumber: string): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ patientNumber });

    if (!patient) {
      throw new BadRequestException(
        `Patient number ${patientNumber} not found.`,
      );
    }

    return patient;
  }

  async get(centreId: string): Promise<Patient[]> {
    return this.patientRepository.findBy({ centreId });
  }

  async update(userId: string, data: UpdatePatientDto): Promise<Patient> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId: data.centreId,
      },
    });

    if (centreAdmin == null) {
      throw new BadRequestException(
        `Centre doesn't exist for centre id: ${data.centreId}`,
      );
    }

    const patient = await this.getById(data.id);

    if (patient == null) {
      throw new BadRequestException(
        `Patient not found to be update, requested patient id: ${data.id}`,
      );
    }

    if (data.age) {
      patient.age = patient.age;
    }
    if (data.gender) {
      patient.gender = patient.gender;
    }
    if (data.email) {
      patient.email = patient.email;
    }
    if (data.address) {
      patient.address = patient.address;
    }
    if (data.abhaId) {
      patient.abhaId = patient.abhaId;
    }

    await this.patientRepository.update(patient.id, patient);

    return patient;
  }
}
