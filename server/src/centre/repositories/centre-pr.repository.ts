import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { CentrePr } from 'src/database/entities/centre-pr.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(CentrePr)
export class CentrePrRepository extends AbstractRepository<CentrePr> {}
