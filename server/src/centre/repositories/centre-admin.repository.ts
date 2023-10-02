import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { CentreAdmin } from 'src/database/entities/centre-admin.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(CentreAdmin)
export class CentreAdminRepository extends AbstractRepository<CentreAdmin> {}
