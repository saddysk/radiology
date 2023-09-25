import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CentreRepository } from './repositories/centre.repository';
import { CentreController } from './centre.controller';
import { CentreService } from './services/centre.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { CentreUserRepository } from './repositories/centre-user.repository';

@Module({
  imports: [
    DatabaseModule.forRepository([
      CentreRepository,
      UserRepository,
      CentreUserRepository,
    ]),
  ],
  controllers: [CentreController],
  providers: [CentreService],
})
export class CentreModule {}
