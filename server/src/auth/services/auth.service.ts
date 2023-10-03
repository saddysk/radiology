import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import { AuthTokenRepository } from '../repositories/auth-token.repository';
import { AuthToken } from 'src/database/entities/auth-token.entity';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { AppConfig } from 'src/config/config';
import * as bcrypt from 'bcrypt';
import { IAuthUser } from 'libs/interfaces/auth-user.interface';
import { UserRole } from 'src/database/enums/user.enum';
import { CentreService } from 'src/centre/services/centre.service';

const CONFIG = AppConfig();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly centreService: CentreService,
  ) {}

  async create(data: CreateUserDto): Promise<IAuthUser> {
    const email = data.email;

    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (user != null) {
      throw new ConflictException(
        `User already exist for this email id: ${email}`,
      );
    }

    user = new User();
    user.email = email;
    user.name = data.name;
    user.role = data.role;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user, { reload: true });

    if (user.role === UserRole.Admin && data.centreId) {
      await this.centreService.addAdminToCentre(user.id, data.centreId);
    }

    const token = await this.createAuthToken(user);

    return { token, user };
  }

  async login(data: LoginUserDto): Promise<IAuthUser> {
    const { email, password } = data;

    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      throw new NotFoundException(`User not found, email: ${email}`);
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Create an auth token record
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
}
