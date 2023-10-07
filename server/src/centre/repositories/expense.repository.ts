import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Expense } from 'src/database/entities/expense.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(Expense)
export class ExpenseRepository extends AbstractRepository<Expense> {}
