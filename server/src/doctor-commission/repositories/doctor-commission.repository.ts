import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { DoctorCommission } from 'src/database/entities/doctor-commission.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(DoctorCommission)
export class DoctorCommissionRepository extends AbstractRepository<DoctorCommission> {}
