import { PickType } from '@nestjs/swagger';
import {
  DateField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from 'libs/decorators';
import { AuthService } from 'src/auth/services/auth.service';
import { Expense } from 'src/database/entities/expense.entity';

export class ExpenseDto {
  @UUIDField()
  id: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @UUIDField()
  centreId: string;

  @DateField()
  date: Date;

  @UUIDField()
  createdBy: string;

  @NumberField()
  amount: number;

  @StringField()
  expenseType: string;

  @StringField()
  name: string;

  @StringField()
  paymentMethod: string;

  @StringFieldOptional()
  remark?: string;

  constructor(expense?: Expense) {
    if (expense == null) {
      return;
    }

    this.id = expense.id;
    this.createdAt = expense.createdAt;
    this.updatedAt = expense.updatedAt;
    this.centreId = expense.centreId;
    this.date = expense.date;
    this.createdBy = expense.createdBy;
    this.amount = expense.amount;
    this.expenseType = expense.expenseType;
    this.name = expense.name;
    this.paymentMethod = expense.paymentMethod;
    this.remark = expense.remark;
  }

  static async toDto(expense: Expense, authService?: AuthService) {
    const dto = new ExpenseDto(expense);

    if (authService) {
      const user = await authService.get(dto.createdBy);
      dto.createdBy = user.name;
    }

    return dto;
  }
}

export class CreateExpenseDto extends PickType(ExpenseDto, [
  'centreId',
  'amount',
  'date',
  'expenseType',
  'name',
  'paymentMethod',
  'remark',
]) {}

export class UpdateExpenseDto extends PickType(ExpenseDto, [
  'id',
  'centreId',
  'amount',
  'expenseType',
  'name',
  'paymentMethod',
  'remark',
]) {}
