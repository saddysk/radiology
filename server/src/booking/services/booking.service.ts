import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from '../dto/booking.dto';
import { BookingRepository } from '../repositories/booking.repository';
import { PatientService } from 'src/patient/services/patient.service';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { CentreService } from 'src/centre/services/centre.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly centreService: CentreService,
    private readonly patientService: PatientService,
    private readonly paymentRepository: PaymentRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
  ) {}

  async create(userId: string, data: CreateBookingDto): Promise<Booking> {
    const centre = await this.centreService.get(userId, data.centreId);

    if (centre == null) {
      throw new BadRequestException(`Invalid centre.`);
    }

    const booking = new Booking();
    booking.centreId = centre.id;
    booking.submittedBy = userId;
    booking.consultant = data.consultant;
    booking.modality = data.modality;
    booking.investigation = data.investigation;
    booking.remark = data.remark;
    // booking.payment = data.payment;

    booking.patientId = await this.getOrCreatePatient(
      userId,
      data.centreId,
      data.patientId,
      data.patient,
    );

    await this.bookingRepository.save(booking);

    await Promise.all(
      data.payment.payments.map((payment) =>
        this.paymentRepository.savePayment(booking.id, {
          discount: data.payment.discount,
          extraCharge: data.payment.extraCharge,
          ...payment,
        }),
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
    centreId: string,
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

    patient = await this.patientService.create(userId, centreId, patientData);
    return patient.id;
  }
}
