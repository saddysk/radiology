import { Body, Controller, Param, Req } from '@nestjs/common';
import { ExpenseService } from './services/expense.service';
import { ApiTags } from '@nestjs/swagger';
import {
  DeleteRoute,
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import {
  CreateExpenseDto,
  ExpenseDto,
  UpdateExpenseDto,
} from './dto/expense.dto';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { SuccessDto } from 'libs/dtos';

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

  @PutRoute('', {
    Ok: ExpenseDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateExpenseDto,
  ): Promise<ExpenseDto> {
    const expense = await this.expenseService.update(
      request.user.user.id,
      data,
    );
    return new ExpenseDto(expense);
  }

  @DeleteRoute(':id', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async delete(
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<SuccessDto> {
    await this.expenseService.delete(request.user.user.id, id);
    return new SuccessDto();
  }
}
