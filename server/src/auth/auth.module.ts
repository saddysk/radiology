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
import { CentrePrRepository } from 'src/centre/repositories/centre-pr.repository';
import { CentreRepository } from 'src/centre/repositories/centre.repository';

const CONFIG = AppConfig();

@Module({
  imports: [
    DatabaseModule.forRepository([
      UserRepository,
      AuthTokenRepository,
      CentrePrRepository,
      CentreRepository,
    ]),
    PassportModule,
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
  exports: [AuthService],
})
export class AuthModule {}
