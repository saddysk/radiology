import { Body, Controller, Param, Req } from '@nestjs/common';
import { ExpenseService } from './services/expense.service';
import { ApiTags } from '@nestjs/swagger';
import { GetRoute, PostRoute } from 'libs/decorators/route.decorators';
import { CreateExpenseDto, ExpenseDto } from './dto/expense.dto';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';

@Controller('api/centre/expense')
@ApiTags('Centre Expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @PostRoute('', {
    Ok: ExpenseDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async create(
    @Req() request: any,
    @Body() data: CreateExpenseDto,
  ): Promise<ExpenseDto> {
    const expense = await this.expenseService.create(
      request.user.user.id,
      data,
    );

    return new ExpenseDto(expense);
  }

  @GetRoute(':centreId', {
    Ok: { dtoType: 'ArrayDto', type: ExpenseDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAll(
    @Req() request: any,
    @Param('centreId') centreId: string,
  ): Promise<ExpenseDto[]> {
    const expenses = await this.expenseService.getAll(
      request.user.user.id,
      centreId,
    );

    return expenses.map((expense) => new ExpenseDto(expense));
  }

  @GetRoute(':centreId/:id/', {
    Ok: ExpenseDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(
    @Req() request: any,
    @Param('id') id: string,
    @Param('centreId') centreId: string,
  ): Promise<ExpenseDto> {
    const expense = await this.expenseService.get(
      request.user.user.id,
      centreId,
      id,
    );

    return new ExpenseDto(expense);
  }
}
