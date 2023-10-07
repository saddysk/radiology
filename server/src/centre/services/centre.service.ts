import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    const centre = await this.centreRepository.findOne({
      where: {
        email: data.email,
        name: data.name,
      },
    });

    if (centre != null) {
      throw new BadRequestException(
        `Centre already exist with this combination of email id: ${data.email} & name: ${data.name}`,
      );
    }

    centre.name = data.name;
    centre.email = data.email;
    centre.phone = data.phone;
    centre.address = data.address;

    await this.centreRepository.save(centre, { reload: true });

    if (user.role === UserRole.Admin) {
      await this.addAdminToCentre(user.id, centre.id);
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

    const centre = await Promise.all(centreAdmin.map((ca) => ca.centre));

    return centre;
  }

  getCentres(): Promise<Centre[]> {
    return this.centreRepository.find();
  }

  async addAdminToCentre(
    userId: string,
    centreId: string,
  ): Promise<CentreAdmin> {
    const centreAdmin = new CentreAdmin();

    centreAdmin.centreId = centreId;
    centreAdmin.userId = userId;

    await this.centreAdminRepository.save(centreAdmin, { reload: true });

    return centreAdmin;
  }
}
