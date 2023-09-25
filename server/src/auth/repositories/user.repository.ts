import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { User } from 'src/database/entities/user.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(User)
export class UserRepository extends AbstractRepository<User> {}
