import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RateListService } from './services/rate-list.service';
import {
  RateListDto,
  CreateRateListDto,
  UpdateRateListDto,
} from './dto/rate-list.dto';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import {
  DeleteRoute,
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import { SuccessDto } from 'libs/dtos';

@Controller('api/centre/rate-list')
@ApiTags('Centre Rate List')
export class RateListController {
  constructor(private readonly rateListService: RateListService) {}

  @PostRoute('', {
    Ok: { dtoType: 'ArrayDto', type: RateListDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async create(
    @Req() request: any,
    @Body() data: CreateRateListDto,
  ): Promise<RateListDto[]> {
    const rateLists = await this.rateListService.create(
      request.user.user.id,
      data,
    );
    return rateLists.map((rateList) => new RateListDto(rateList));
  }

  @GetRoute(':centreId/centre', {
    Ok: { dtoType: 'ArrayDto', type: RateListDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(
    @Req() request: any,
    @Param('centreId') centreId: string,
  ): Promise<RateListDto[]> {
    const rateLists = await this.rateListService.get(
      request.user.user.id,
      centreId,
    );
    return rateLists.map((rateList) => new RateListDto(rateList));
  }

  @GetRoute(':id', {
    Ok: RateListDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getById(@Param('id') id: string): Promise<RateListDto> {
    const rateList = await this.rateListService.getById(id);
    return new RateListDto(rateList);
  }

  @PutRoute('', {
    Ok: RateListDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateRateListDto,
  ): Promise<RateListDto> {
    const rateList = await this.rateListService.update(
      request.user.user.id,
      data,
    );
    return new RateListDto(rateList);
  }

  @DeleteRoute(':id', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async delete(
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<SuccessDto> {
    await this.rateListService.delete(request.user.user.id, id);
    return new SuccessDto();
  }
}
