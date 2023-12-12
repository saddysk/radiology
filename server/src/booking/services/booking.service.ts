import { Injectable, BadRequestException } from '@nestjs/common';
import { Booking } from 'src/database/entities/booking.entity';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UploadRecordDto,
} from '../dto/booking.dto';
import { BookingRepository } from '../repositories/booking.repository';
import { PatientService } from 'src/patient/services/patient.service';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { CentreService } from 'src/centre/services/centre.service';
import {
  StorageFileTypes,
  StorageService,
} from 'src/storage/services/storage.service';
import { uuid } from 'libs/helpers/generator.helper';
import { UserRole } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { Not } from 'typeorm';
import { PatientRepository } from 'src/patient/repositories/patient.repository';
import { DoctorCommissionRepository } from 'src/doctor-commission/repositories/doctor-commission.repository';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly centreService: CentreService,
    private readonly patientService: PatientService,
    private readonly patientRepository: PatientRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
    private readonly storageService: StorageService,
    private readonly userRepository: UserRepository,
    private doctorCommissionRepository: DoctorCommissionRepository,
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
    booking.referralAmount = data.referralAmount ?? 0;
    booking.totalAmount = data.totalAmount;

    if (data.smkId) {
      booking.smkId = data.smkId;
    }

    booking.patientId = await this.getOrCreatePatient(
      userId,
      centre.id,
      data.patientNumber,
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

  async getDoctoReferrals(doctorId: string): Promise<Booking[]> {
    const doctor = await this.userRepository.findOneBy({
      id: doctorId,
      role: UserRole.Doctor,
    });

    if (doctor == null) {
      throw new BadRequestException(`Invalid doctor id: ${doctorId}`);
    }

    const bookings = await this.bookingRepository.find({
      where: {
        consultant: doctor.id,
        referralAmount: Not(0),
      },
    });

    return bookings;
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

  async migration(userId: string, data: any) {
    const patient$ = this.patientRepository.findOneBy({
      name: data.patient.name,
    });

    const doctor$ = this.doctorCommissionRepository
      .createQueryBuilder('commission')
      .leftJoinAndSelect('commission.doctor', 'user')
      .select(['commission.doctorId as doctorid, amount'])
      .where('commission.modality = :modality', { modality: data.modality })
      .getRawOne();

    const [patient, doctor] = await Promise.all([patient$, doctor$]);

    const createBookingDto = new CreateBookingDto();

    createBookingDto.centreId = data.centreId;
    createBookingDto.smkId = data.smkId;
    createBookingDto.consultant = doctor.doctorid;
    createBookingDto.modality = data.modality;
    createBookingDto.investigation = data.investigation;
    createBookingDto.remark = data.remark;
    createBookingDto.totalAmount = data.totalAmount;
    createBookingDto.payment = data.payment;

    createBookingDto.referralAmount = Math.round(
      (doctor.amount / 100) * data.totalAmount,
    );

    if (patient != null) {
      createBookingDto.patientNumber = patient.patientNumber;
    } else {
      createBookingDto.patient = data.patient;
    }

    await this.create(userId, createBookingDto);
  }

  private async getOrCreatePatient(
    userId: string,
    centreId: string,
    patientNumber?: string,
    patientData?: CreatePatientDto,
  ): Promise<string> {
    let patient =
      patientNumber &&
      (await this.patientService.getByPatientNumber(patientNumber));

    if (patient) {
      return patient.id;
    }

    if (patientData == null) {
      throw new BadRequestException(`Invalid patient data.`);
    }

    patient = await this.patientService.create(userId, centreId, patientData);
    return patient.id;
  }
}
