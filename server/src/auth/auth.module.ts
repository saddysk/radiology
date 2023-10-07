import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { BearerStrategy } from './strategies/bearer.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from 'src/config/config';
import { AuthTokenRepository } from './repositories/auth-token.repository';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { InternalStrategy } from './strategies/internal.strategy';
import { CentreModule } from 'src/centre/centre.module';

const CONFIG = AppConfig();

@Module({
  imports: [
    DatabaseModule.forRepository([UserRepository, AuthTokenRepository]),
    PassportModule,
    CentreModule,
    JwtModule.register({
      privateKey: CONFIG.JWT_PRIVATE_KEY,
      publicKey: CONFIG.JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: 'RS256',
      },
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [InternalStrategy, BearerStrategy, AuthService],
})
export class AuthModule {}
