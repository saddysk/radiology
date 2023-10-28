import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from '../dto/expense.dto';
import { Expense } from 'src/database/entities/expense.entity';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CentreRepository } from 'src/centre/repositories/centre.repository';
import { CentreAdminRepository } from '../repositories/centre-admin.repository';
import { CentreService } from './centre.service';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly centreRepository: CentreRepository,
    private readonly centreService: CentreService,
    private readonly centreAdminRepository: CentreAdminRepository,
  ) {}

  async create(userId: string, data: CreateExpenseDto): Promise<Expense> {
    const centre = await this.centreRepository.findOneBy({ id: data.centreId });

    if (centre == null) {
      throw new BadRequestException(
        `Invalid. Centre not found for centre id: ${data.centreId}`,
      );
    }

    // Create and Save Expense
    const newExpense = new Expense();
    newExpense.createdBy = userId;
    newExpense.centreId = centre.id;
    newExpense.amount = data.amount;
    newExpense.date = data.date;
    newExpense.expenseType = data.expenseType;
    newExpense.paymentMethod = data.paymentMethod;
    newExpense.remark = data.remark;

    await this.expenseRepository.save(newExpense, { reload: true });

    return newExpense;
  }

  async getAll(userId: string, centreId: string): Promise<Expense[]> {
    const centre = await this.centreService.get(userId, centreId);

    if (centre == null) {
      throw new BadRequestException(
        `User is not associated to any centre id: ${centreId}, user id: ${userId}`,
      );
    }

    const expense = await this.expenseRepository.findBy({ centreId });

    return expense;
  }

  async get(userId: string, centreId: string, id: string): Promise<Expense> {
    const centre = await this.centreService.get(userId, centreId);

    if (centre == null) {
      throw new BadRequestException(
        `User is not associated to any centre id: ${centreId}, user id: ${userId}`,
      );
    }

    const expense = await this.expenseRepository.findOneBy({ id });

    return expense;
  }

  async update(userId: string, expenseData: Expense): Promise<Expense> {
    const centreAdmin = await this.centreAdminRepository.findOne({
      where: {
        userId,
        centreId: expenseData.centreId,
      },
    });

    if (centreAdmin == null) {
      throw new BadRequestException(
        `User is not associated to any centre id: ${expenseData.centreId}, user id: ${userId}`,
      );
    }

    const expense = await this.expenseRepository.findOneBy({
      id: expenseData.id,
    });

    if (expense == null) {
      throw new BadRequestException(
        `Expense not found to be update, requested expense id: ${expenseData.id}`,
      );
    }

    await this.expenseRepository.save(expenseData);

    return expenseData;
  }
}
