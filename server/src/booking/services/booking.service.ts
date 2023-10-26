import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from '../dto/booking.dto';
import { BookingRepository } from '../repositories/booking.repository';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { PatientService } from 'src/patient/services/patient.service';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';
import { UserRole } from 'src/database/entities/user.entity';
import { PaymentRepository } from '../repositories/payment.repository';
import { In } from 'typeorm';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userRepository: UserRepository,
    private readonly patientService: PatientService,
    private readonly paymentRepository: PaymentRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
  ) {}

  async create(userId: string, data: CreateBookingDto): Promise<Booking> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: In([UserRole.Admin, UserRole.Receptionist]),
    });

    // if (user == null) {
    //   throw new BadRequestException(
    //     `Inavlid user role user id: ${userId}. User should be ${UserRole.Receptionist} to add patient.`,
    //   );
    // }

    const booking = new Booking();
    booking.centreId = user.centreId;
    booking.submittedBy = user.id;
    booking.consultant = data.consultant;
    booking.modality = data.modality;
    booking.investigation = data.investigation;
    booking.remark = data.remark;
    // booking.payment = data.payment;

    booking.patientId = await this.getOrCreatePatient(
      userId,
      data.patientId,
      data.patient,
    );

    await this.bookingRepository.save(booking);

    await Promise.all(
      data.payment.map((payment) =>
        this.paymentRepository.savePayment(booking.id, payment),
      ),
    );

    return booking;
  }

  async getById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOneBy({ id });

    if (!booking) {
      throw new BadRequestException(`Booking with id ${id} not found.`);
    }

    return booking;
  }

  async get(centreId: string): Promise<Booking[]> {
    return this.bookingRepository.findBy({ centreId });
  }

  async update(userId: string, bookingData: Booking): Promise<Booking> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId: bookingData.centreId,
      },
    });

    if (centreAdmin == null) {
      throw new BadRequestException(
        `Centre doesn't exist for centre id: ${bookingData.centreId}, user id: ${userId}`,
      );
    }

    const booking = await this.bookingRepository.findOneBy({
      id: bookingData.id,
    });

    if (booking == null) {
      throw new BadRequestException(
        `Expense not found to be update, requested booking id: ${bookingData.id}`,
      );
    }

    await this.bookingRepository.save(bookingData);

    return bookingData;
  }

  private async getOrCreatePatient(
    userId: string,
    patientId?: string,
    patientData?: CreatePatientDto,
  ): Promise<string> {
    let patient: Patient = null;

    patient = patientId && (await this.patientService.getById(patientId));
    if (patient != null) {
      return patient.id;
    }

    if (patientData == null) {
      throw new BadRequestException(`Invalid patient data.`);
    }

    patient = await this.patientService.create(userId, patientData);
    return patient.id;
  }
}
