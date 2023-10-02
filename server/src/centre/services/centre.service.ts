import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CentreRepository } from '../repositories/centre.repository';
import { Centre } from 'src/database/entities/centre.entity';
import { CreateCentreDto } from '../dto/centre.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { UserRole } from 'src/database/enums/user.enum';
import { CentreAdminRepository } from '../repositories/centre-admin.repository';
import { CentreAdmin } from 'src/database/entities/centre-admin.entity';

@Injectable()
export class CentreService {
  constructor(
    private readonly centreRepository: CentreRepository,
    private readonly userRepository: UserRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
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

    if (user.role === UserRole.Admin) {
      const centreAdmin = new CentreAdmin();
      centreAdmin.centreId = centre.id;
      centreAdmin.userId = user.id;

      await this.centreAdminRepository.save(centreAdmin, { reload: true });
    }

    if (user.role === UserRole.Receptionist) {
      user.centreId = centre.id;

      await this.userRepository.update(
        { id: user.id },
        { centreId: user.centreId },
      );
    }

    return centre;
  }

  async get(userId: string, centreId: string): Promise<Centre> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId,
      },
    });

    return centreAdmin.centre;
  }

  async getAll(userId: string): Promise<Centre[]> {
    const centreAdmin = await this.centreAdminRepository.find({
      where: {
        userId,
      },
    });

    const centre = await Promise.all(centreAdmin.map((uc) => uc.centre));

    return centre;
  }

  getCentres(): Promise<Centre[]> {
    return this.centreRepository.find();
  }
}
