import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CentreRepository } from '../repositories/centre.repository';
import { Centre } from 'src/database/entities/centre.entity';
import { CreateCentreDto } from '../dto/centre.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreAdminRepository } from '../repositories/centre-admin.repository';
import { CentreAdmin } from 'src/database/entities/centre-admin.entity';
import { UserRole } from 'src/database/entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { CentrePrRepository } from '../repositories/centre-pr.repository';
import { DoctorCommissionRepository } from 'src/doctor-commission/repositories/doctor-commission.repository';

@Injectable()
export class CentreService {
  constructor(
    private readonly centreRepository: CentreRepository,
    private readonly userRepository: UserRepository,
    private readonly authSerice: AuthService,
    private readonly centreAdminRepository: CentreAdminRepository,
    private readonly centrePrRepository: CentrePrRepository,
    private readonly doctorCommissionRepository: DoctorCommissionRepository,
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

    const centreExist = await this.centreRepository.findOne({
      where: {
        email: data.email,
        name: data.name,
      },
    });

    if (centreExist != null) {
      throw new BadRequestException(
        `Centre already exist with this combination of email id: ${data.email} & name: ${data.name}`,
      );
    }

    const centre = new Centre();
    centre.name = data.name;
    centre.email = data.email;
    centre.phone = data.phone;
    centre.address = data.address;

    await this.centreRepository.save(centre, { reload: true });

    const updatedCentre = await this.centreRepository.generateCentreNumber(
      centre,
    );

    if (user.role === UserRole.Admin) {
      await this.addAdminToCentre(user.id, updatedCentre.centreNumber);
    } else if (user.role === UserRole.Receptionist) {
      user.centreId = centre.id;

      await this.userRepository.update(
        { id: user.id },
        { centreId: user.centreId },
      );
    }

    return centre;
  }

  async addAdminToCentre(
    userId: string,
    centreNumber: string,
  ): Promise<CentreAdmin> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user.role !== UserRole.Admin) {
      throw new BadRequestException(
        `User should be admin to join a centre, but found user: ${userId}`,
      );
    }

    const centre = await this.centreRepository.findOneBy({ centreNumber });

    if (centre == null) {
      throw new BadRequestException(
        `Centre not found for centre number: ${centreNumber}`,
      );
    }

    let centreAdmin = await this.centreAdminRepository.findOneBy({
      userId,
      centreId: centre.id,
    });

    if (centreAdmin != null) {
      throw new BadRequestException('Admin already added to the centre');
    }

    centreAdmin = new CentreAdmin();

    centreAdmin.centreId = centre.id;
    centreAdmin.userId = user.id;

    await this.centreAdminRepository.save(centreAdmin, { reload: true });

    return centreAdmin;
  }

  async get(userId: string, centreId: string): Promise<Centre> {
    const user = await this.authSerice.get(userId);

    if (user.role === UserRole.Admin) {
      const centreAdmin = await this.centreAdminRepository.findOne({
        where: {
          userId,
          centreId,
        },
      });
      return centreAdmin.centre;
    } else if (user.role === UserRole.Pr) {
      const centrePr = await this.centrePrRepository.findOne({
        where: {
          userId,
          centreId,
        },
      });
      return centrePr.centre;
    } else if (user.role === UserRole.Doctor) {
      const centreDoctor = await this.doctorCommissionRepository.findOne({
        where: {
          doctorId: userId,
          centreId,
        },
      });
      return centreDoctor.centre;
    } else {
      return this.centreRepository.findOneBy({
        id: user.centreId,
      });
    }
  }

  async getAll(userId: string): Promise<Centre[]> {
    const user = await this.authSerice.get(userId);

    if (user.role === UserRole.Admin) {
      const centreAdmin = await this.centreAdminRepository.find({
        where: {
          userId,
        },
      });
      const centre = await Promise.all(centreAdmin.map((ca) => ca.centre));
      return centre;
    } else if (user.role === UserRole.Pr) {
      const centrePr = await this.centrePrRepository.find({
        where: {
          userId,
        },
      });
      const centre = await Promise.all(centrePr.map((cp) => cp.centre));
      return centre;
    } else if (user.role === UserRole.Doctor) {
      const centreDoctor = await this.doctorCommissionRepository.find({
        where: {
          doctorId: userId,
        },
      });
      const centre = await Promise.all(centreDoctor.map((cd) => cd.centre));
      return centre;
    }
  }

  // getCentres(): Promise<Centre[]> {
  //   return this.centreRepository.find();
  // }
}
