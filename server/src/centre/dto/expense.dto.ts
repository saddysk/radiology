import { PickType } from '@nestjs/swagger';
import {
  DateField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from 'libs/decorators';
import { Expense } from 'src/database/entities/expense.entity';

export class ExpenseDto {
  @UUIDField()
  id: string;

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
  paymentMethod: string;

  @StringFieldOptional()
  remark?: string;

  constructor(expense?: Expense) {
    if (expense == null) {
      return;
    }

    this.id = expense.id;
    this.centreId = expense.centreId;
    this.date = expense.date;
    this.createdBy = expense.createdBy;
    this.amount = expense.amount;
    this.expenseType = expense.expenseType;
    this.paymentMethod = expense.paymentMethod;
    this.remark = expense.remark;
  }
}

export class CreateExpenseDto extends PickType(ExpenseDto, [
  'centreId',
  'amount',
  'date',
  'expenseType',
  'paymentMethod',
  'remark',
]) {}
