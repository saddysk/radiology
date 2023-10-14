import { Injectable, BadRequestException } from '@nestjs/common';
import { RateListRepository } from '../repositories/rate-list.repository';
import { RateList } from 'src/database/entities/rate-list.entity';
import {
  CreateRateListDto,
  RateListsDto,
  UpdateRateListDto,
} from '../dto/rate-list.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserRole } from 'src/database/enums/user.enum';
import { In } from 'typeorm';

@Injectable()
export class RateListService {
  constructor(
    private readonly rateListRepository: RateListRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(userId: string, data: CreateRateListDto): Promise<RateList[]> {
    // Example: Ensure the user is an admin
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.Admin,
      },
    });

    if (!user) {
      throw new BadRequestException('Only admin can create a rate list');
    }

    const rateListExists = await this.rateListRepository.findOne({
      where: {
        centreId: data.centreId,
        modality: In(data.rateLists.map((rateList) => rateList.modality)),
      },
    });

    if (rateListExists) {
      throw new BadRequestException(
        'Rate list for the modality already exists.',
      );
    }

    // Create and Save RateList
    const rateList = await Promise.all(
      data.rateLists.map((rateList) =>
        this.saveRateList(data.centreId, rateList),
      ),
    );

    return rateList;
  }

  async get(userId: string, centreId: string): Promise<RateList[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: In([UserRole.Receptionist, UserRole.Admin]),
      },
    });

    if (user == null) {
      throw new BadRequestException(
        `Invalid Access! Only admin or receptionist can get the rate list.`,
      );
    }

    return this.rateListRepository.find({
      where: {
        centreId,
      },
    });
  }

  async getById(rateListId: string): Promise<RateList> {
    const rateList = await this.rateListRepository.findOne({
      where: {
        id: rateListId,
      },
    });

    if (!rateList) {
      throw new BadRequestException(`RateList with id ${rateListId} not found`);
    }

    return rateList;
  }

  async update(userId: string, data: UpdateRateListDto): Promise<RateList> {
    // Example: Ensure the user is an admin
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.Admin,
      },
    });

    if (!user) {
      throw new BadRequestException('Only admin can update a rate list');
    }

    const rateList = await this.rateListRepository.findOne({
      where: {
        id: data.id,
      },
    });

    if (!rateList) {
      throw new BadRequestException(`RateList with id ${data.id} not found`);
    }

    // Update fields and save the rateList
    rateList.investigation = data.investigation;

    await this.rateListRepository.update(data.id, rateList);

    return rateList;
  }

  private saveRateList(
    centreId: string,
    data: RateListsDto,
  ): Promise<RateList> {
    const rateList = new RateList();
    rateList.centreId = centreId;
    rateList.modality = data.modality;
    rateList.investigation = data.investigation;

    return this.rateListRepository.save(rateList, { reload: true });
  }
}
