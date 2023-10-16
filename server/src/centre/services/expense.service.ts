import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpenseDto, ExpensesDto } from '../dto/expense.dto';
import { Expense } from 'src/database/entities/expense.entity';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CentreRepository } from 'src/centre/repositories/centre.repository';
import { CentreAdminRepository } from '../repositories/centre-admin.repository';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly centreRepository: CentreRepository,
    private readonly centreAdminRepository: CentreAdminRepository,
  ) {}

  async create(userId: string, data: CreateExpenseDto): Promise<Expense[]> {
    const centre = await this.centreRepository.findOneBy({ id: data.centreId });

    if (centre == null) {
      throw new BadRequestException(
        `Invalid. Centre not found for centre id: ${data.centreId}`,
      );
    }

    // Create and Save Expense
    const expenseList = await Promise.all(
      data.expenses.map((expense) =>
        this.saveExpense(userId, centre.id, expense),
      ),
    );

    return expenseList;
  }

  async getAll(userId: string, centreId: string): Promise<Expense[]> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId,
      },
    });

    if (centreAdmin == null) {
      throw new BadRequestException(
        `Centre doesn't exist for centre id: ${centreId}, user id: ${userId}`,
      );
    }

    const expense = await this.expenseRepository.findBy({ centreId });

    return expense;
  }

  async get(userId: string, centreId: string, id: string): Promise<Expense> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId,
      },
    });

    if (centreAdmin == null) {
      throw new BadRequestException(
        `Centre doesn't exist for centre id: ${centreId}, user id: ${userId}`,
      );
    }

    const expense = await this.expenseRepository.findOneBy({ id });

    return expense;
  }

  private saveExpense(
    userId: string,
    centreId: string,
    data: ExpensesDto,
  ): Promise<Expense> {
    const newExpense = new Expense();
    newExpense.createdBy = userId;
    newExpense.centreId = centreId;
    newExpense.amount = data.amount;
    newExpense.date = data.date;
    newExpense.expenseType = data.expenseType;
    newExpense.paymentMethod = data.paymentMethod;
    newExpense.remark = data.remark;

    return this.expenseRepository.save(newExpense, { reload: true });
  }
}
