import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateRequestRepository } from '../repositories/update-request.repository';
import { CreateUpdateRequestDto } from '../dto/update-request.dto';
import {
  RequestStatus,
  RequestType,
  UpdateRequest,
} from 'src/database/entities/update-request.entity';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { In } from 'typeorm';
import { UserRole } from 'src/database/entities/user.entity';
import { CentreAdminRepository } from 'src/centre/repositories/centre-admin.repository';
import { ExpenseService } from 'src/centre/services/expense.service';
import { BookingService } from 'src/booking/services/booking.service';
import { BookingRepository } from 'src/booking/repositories/booking.repository';
import { ExpenseRepository } from 'src/centre/repositories/expense.repository';

@Injectable()
export class UpdateRequestService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly updateRequestRepository: UpdateRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
    private readonly expenseService: ExpenseService,
    private readonly bookingService: BookingService,
  ) { }

  async save(userId: string, data: CreateUpdateRequestDto) {
    const user = this.userRepository.findOne({
      where: {
        id: userId,
        role: In([UserRole.Receptionist, UserRole.Pr]),
      },
    });
    if (user == null) {
      throw new BadRequestException(
        `Invalid user with id: ${userId}. Only ${UserRole.Receptionist} or ${UserRole.Pr} can request for data update.`,
      );
    }

    const updateRequest = new UpdateRequest();
    updateRequest.requestedBy = userId;
    updateRequest.type = data.type;

    if (data.expenseData) {
      updateRequest.expenseData = data.expenseData;
      updateRequest.centreId = data.expenseData.centreId;
    }
    if (data.bookingData) {
      updateRequest.bookingData = data.bookingData;
      updateRequest.centreId = data.bookingData.centreId;
    }

    await this.updateRequestRepository.save(updateRequest, { reload: true });
  }

  async getById(userId: string, id: string): Promise<UpdateRequest> {
    const admin = this.userRepository.findOne({
      where: { id: userId },
    });
    if (admin == null) {
      throw new BadRequestException(
        `Invalid user, user id: ${userId}. Only ${UserRole.Admin} can view a update request.`,
      );
    }

    return this.updateRequestRepository.findOneBy({ id });
  }

  async get(userId: string, centreId: string): Promise<UpdateRequest[]> {
    const admin = this.centreAdminRepository.findOne({
      where: { userId, centreId },
    });
    if (admin == null) {
      throw new BadRequestException(
        `Invalid user, user id: ${userId}. Only ${UserRole.Admin} can view the update requests.`,
      );
    }

    return this.updateRequestRepository.findBy({ centreId });
  }

  async update(userId: string, id: string, status: RequestStatus) {
    const updateRequest = await this.validateRequest(userId, id);

    if (status === RequestStatus.Pending) {
      throw new BadRequestException(
        `Invalid request status. You can't mark a request as ${RequestStatus.Pending}.`,
      );
    }

    if (status === RequestStatus.Accepted) {
      if (updateRequest.type === RequestType.Expense) {
        await this.expenseService.update(userId, updateRequest.expenseData);
        const existingData = await this.expenseRepository.findOneBy({ id: updateRequest.expenseData.id });
        updateRequest.approvedData = existingData
      }
      if (updateRequest.type === RequestType.Booking) {
        await this.bookingService.update(userId, updateRequest.bookingData);
        const existingData = await this.bookingRepository.findOneBy({ id: updateRequest.bookingData.id });
        updateRequest.approvedData = existingData
      }

      await this.updateRequestRepository.upadteStatus(
        updateRequest.id,
        RequestStatus.Accepted,
        updateRequest.approvedData,
      );
    } else {
      await this.updateRequestRepository.upadteStatus(
        updateRequest.id,
        RequestStatus.Rejected,
      );
    }
  }

  private async validateRequest(
    userId: string,
    id: string,
  ): Promise<UpdateRequest> {
    const admin = this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.Admin,
      },
    });
    if (admin == null) {
      throw new BadRequestException(
        `Invalid user with id: ${userId}. Only ${UserRole.Admin} can accept or reject an update request.`,
      );
    }

    const updateRequest = await this.updateRequestRepository.findOne({
      where: {
        id,
        status: RequestStatus.Pending,
      },
    });
    if (updateRequest == null) {
      throw new BadRequestException(
        `Only pending request can be accpted or rejected. Request id: ${id}`,
      );
    }

    return updateRequest;
  }
}
