import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking } from 'src/database/entities/booking.entity';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UploadRecordDto,
} from '../dto/booking.dto';
import { BookingRepository } from '../repositories/booking.repository';
import { PatientService } from 'src/patient/services/patient.service';
import { Patient } from 'src/database/entities/patient.entity';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { CentreService } from 'src/centre/services/centre.service';
import {
  StorageFileTypes,
  StorageService,
} from 'src/storage/services/storage.service';
import { uuid } from 'libs/helpers/generator.helper';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly centreService: CentreService,
    private readonly patientService: PatientService,
    private readonly paymentRepository: PaymentRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
    private readonly storageService: StorageService,
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
    booking.totalAmount = data.totalAmount;

    booking.patientId = await this.getOrCreatePatient(
      userId,
      centre.id,
      data.patientId,
      data.patient,
    );

    if (data.recordFile) {
      const recordUrl = await this.storageService.store(
        StorageFileTypes.PRESCRIPTOIN,
        uuid(),
        Buffer.from(data.recordFile, 'base64'),
      );
      booking.records = [
        {
          url: recordUrl,
          type: StorageFileTypes.PRESCRIPTOIN,
        },
      ];
    }

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

  async update(
    userId: string,
    bookingData: UpdateBookingDto,
  ): Promise<Booking> {
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

    const updatedBooking = await this.bookingRepository.save(bookingData);

    return updatedBooking;
  }

  async uploadRecord(data: UploadRecordDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOneBy({
      id: data.id,
    });

    if (booking == null) {
      throw new BadRequestException(
        `Expense not found to be update, requested booking id: ${data.id}`,
      );
    }

    if (data.recordFile) {
      const recordUrl = await this.storageService.store(
        StorageFileTypes.REPORT,
        uuid(),
        Buffer.from(data.recordFile, 'base64'),
      );
      booking.records = [
        ...booking.records,
        {
          url: recordUrl,
          type: StorageFileTypes.REPORT,
        },
      ];
    }

    await this.bookingRepository.update(booking.id, {
      records: booking.records,
    });

    return booking;
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
