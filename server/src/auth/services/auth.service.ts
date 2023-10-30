import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/database/entities/user.entity';
import { AuthTokenRepository } from '../repositories/auth-token.repository';
import { AuthToken } from 'src/database/entities/auth-token.entity';
import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdateUserDto,
} from '../dto/user.dto';
import { AppConfig } from 'src/config/config';
import * as bcrypt from 'bcrypt';
import { IAuthUser } from 'libs/interfaces/auth-user.interface';
import { CentrePr } from 'src/database/entities/centre-pr.entity';
import { CentrePrRepository } from 'src/centre/repositories/centre-pr.repository';

const CONFIG = AppConfig();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly centrePrRepository: CentrePrRepository,
  ) {}

  async create(data: CreateUserDto): Promise<IAuthUser> {
    const email = data.email;

    let user = await this.userRepository.findOneBy({ email });

    if (user != null) {
      throw new ConflictException(
        `User already exist for this email id: ${email}`,
      );
    }

    user = new User();
    user.email = email;
    user.name = data.name;
    user.role = data.role;

    if (data.role === UserRole.Admin) {
      user.isFirstLogin = false;
    }
    if (data.centreId) {
      user.centreId = data.centreId;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user, { reload: true });

    if (user.role === UserRole.Pr) {
      await this.addPrToCentre(user.id, data.centreId);
    }

    const token = await this.createAuthToken(user);

    return { token, user };
  }

  async login(data: LoginUserDto): Promise<IAuthUser> {
    const { email, password } = data;

    // Find the user by email
    const user = await this.userRepository.findOneBy({ email });

    // Check if the user exists
    if (!user) {
      throw new BadRequestException(`User not found, email: ${email}`);
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.role !== UserRole.Admin && user.isFirstLogin) {
      throw new HttpException(user.id, 423);
    }

    // Create an auth token record
    const token = await this.createAuthToken(user);

    return { token, user };
  }

  async resetPassword(data: ResetPasswordDto): Promise<IAuthUser> {
    const { email, newPassword } = data;

    // Find the user by email
    const user = await this.userRepository.findOneBy({ email });

    if (user == null) {
      throw new BadRequestException(
        `Can't reset password. User not found for email id: ${email}.`,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }

    await this.userRepository.update(user.id, {
      password: user.password,
      isFirstLogin: user.isFirstLogin,
    });

    console.log(user);

    const token = await this.createAuthToken(user);

    return { token, user };
  }

  async logout(tokenId: string) {
    return this.authTokenRepository.revokeToken(tokenId);
  }

  async validateUserByToken(plainToken: string): Promise<AuthToken> {
    const token = await this.authTokenRepository.findOne({
      where: {
        hash: plainToken,
      },
    });

    if (token == null) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.authTokenRepository.validateAndGetToken(token);
  }

  async update(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user == null) {
      throw new BadRequestException(`User not found, id: ${userId}`);
    }

    if (data.name) {
      user.name = data.name;
    }

    await this.userRepository.save(user);

    return user;
  }

  getDoctors(): Promise<User[]> {
    return this.userRepository.findBy({ role: UserRole.Doctor });
  }

  get(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  private async createAuthToken(user: User): Promise<AuthToken> {
    const accessToken = await this.jwtService.sign(
      { user: user.id },
      {
        secret: CONFIG.JWT_PRIVATE_KEY,
      },
    );

    const token = await this.authTokenRepository.createAuthToken(
      accessToken,
      user,
      this.jwtService,
    );

    return token;
  }

  private async addPrToCentre(
    userId: string,
    centreId: string,
  ): Promise<CentrePr> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user.role !== UserRole.Pr) {
      throw new BadRequestException(
        `User should be pr to join a centre, but found user: ${userId}`,
      );
    }

    const centrePr = new CentrePr();

    centrePr.centreId = centreId;
    centrePr.userId = user.id;

    await this.centrePrRepository.save(centrePr, { reload: true });

    return centrePr;
  }
}
