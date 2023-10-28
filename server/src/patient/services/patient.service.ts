import { Injectable, BadRequestException } from '@nestjs/common';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { PatientRepository } from '../repositories/patient.repository';
import { CentreService } from 'src/centre/services/centre.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly centreService: CentreService,
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
