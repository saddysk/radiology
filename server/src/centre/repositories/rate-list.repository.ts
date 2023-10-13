import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { RateList } from 'src/database/entities/rate-list.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(RateList)
export class RateListRepository extends AbstractRepository<RateList> {}
