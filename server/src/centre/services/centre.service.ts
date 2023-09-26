import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CentreRepository } from '../repositories/centre.repository';
import { Centre } from 'src/database/entities/centre.entity';
import { CreateCentreDto } from '../dto/centre.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserRole } from 'src/database/enums/user.enum';
import { CentreUserRepository } from '../repositories/centre-user.repository';
import { CentreUser } from 'src/database/entities/centre-user.entity';

@Injectable()
export class CentreService {
  constructor(
    private readonly centreRepository: CentreRepository,
    private readonly userRepository: UserRepository,
    private readonly centreUserRepository: CentreUserRepository,
  ) {}

  async create(userId: string, data: CreateCentreDto): Promise<Centre> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.Admin,
      },
    });

    if (user == null) {
      throw new UnauthorizedException(`Only admin can create a centre`);
    }

    // TODO: should we check for existing centre with any combination as done below?
    // const centre = await this.centreRepository.findOne({
    //   where: {
    //     email: data.email,
    //     name: data.name,
    //     phone: data.phone,
    //   },
    // });

    // if (centre != null) {
    //   throw new ConflictException(
    //     `Centre already exist with this combination of email id: ${data.email} & name: ${data.name}`,
    //   );
    // }

    const centre = new Centre();
    centre.name = data.name;
    centre.email = data.email;
    centre.phone = data.phone;
    centre.address = data.address;

    await this.centreRepository.save(centre, { reload: true });

    if (user.role == UserRole.Admin) {
      const centreUser = new CentreUser();
      centreUser.centreId = centre.id;
      centreUser.userId = user.id;

      await this.centreUserRepository.save(centreUser, { reload: true });
    }

    return centre;
  }

  async get(userId: string, centreId: string): Promise<Centre> {
    const userCentre = await this.centreUserRepository.findOne({
      where: {
        userId,
        centreId,
      },
    });

    return userCentre.centre;
  }

  async getAll(userId: string): Promise<Centre[]> {
    const userCentre = await this.centreUserRepository.find({
      where: {
        userId,
      },
    });

    const centre = await Promise.all(userCentre.map((uc) => uc.centre));

    return centre;
  }

  getCentres(): Promise<Centre[]> {
    return this.centreRepository.find();
  }
}
