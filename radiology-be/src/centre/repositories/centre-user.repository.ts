import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { CentreUser } from 'src/database/entities/centre-user.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(CentreUser)
export class CentreUserRepository extends AbstractRepository<CentreUser> {}
