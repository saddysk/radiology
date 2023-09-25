import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Centre } from 'src/database/entities/centre.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(Centre)
export class CentreRepository extends AbstractRepository<Centre> {}
