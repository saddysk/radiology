import {
  BadGatewayException,
  BadRequestException,
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
import bcrypt from 'bcrypt';
import { IAuthUser } from 'libs/interfaces/auth-user.interface';

const CONFIG = AppConfig();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authTokenRepository: AuthTokenRepository,
  ) {}

  async create(data: CreateUserDto): Promise<IAuthUser> {
    const email = data.email;

    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (user != null) {
      throw new BadRequestException(
        `User already exist for this email: ${email}`,
      );
    }

    user = new User();
    user.email = email;
    user.name = data.name;
    user.role = data.role;

    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) {
        throw new BadGatewayException(err);
      }
      user.password = hash;
    });

    // TODO: set after the center is created
    // if (data.centerId != null) {
    //   user.centerId = data.centerId;
    // }

    await this.userRepository.save(user, { reload: true });

    const token = await this.createAuthToken(user);

    return { token, user };
  }

  async login(data: LoginUserDto): Promise<IAuthUser> {
    const { email, password } = data;

    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      throw new NotFoundException('User not found');
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
