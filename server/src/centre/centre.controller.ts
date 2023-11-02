import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CentreService } from './services/centre.service';
import {
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { CentreDto, CreateCentreDto, UpdateCentreDto } from './dto/centre.dto';
import { SuccessDto } from 'libs/dtos';

@Controller('api/centre')
@ApiTags('Centre')
export class CentreController {
  constructor(private readonly centreService: CentreService) {}

  @PostRoute('', {
    Ok: CentreDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async create(
    @Req() request: any,
    @Body() data: CreateCentreDto,
  ): Promise<CentreDto> {
    const centre = await this.centreService.create(request.user.user.id, data);
    return new CentreDto(centre);
  }

  @PostRoute(':centreId/add-admin', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async addAdmin(
    @Req() request: any,
    @Param('centreId') centreId: string,
  ): Promise<SuccessDto> {
    await this.centreService.addAdminToCentre(request.user.user.id, centreId);
    return new SuccessDto();
  }

  @GetRoute('', {
    Ok: { dtoType: 'ArrayDto', type: CentreDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAll(@Req() request: any): Promise<CentreDto[]> {
    const centres = await this.centreService.getAll(request.user.user.id);
    return centres.map((centre) => new CentreDto(centre));
  }

  @GetRoute(':id', {
    Ok: CentreDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Req() request: any, @Param('id') id: string): Promise<CentreDto> {
    const centre = await this.centreService.get(request.user.user.id, id);
    return new CentreDto(centre);
  }

  @PutRoute('', {
    Ok: UpdateCentreDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateCentreDto,
  ): Promise<CentreDto> {
    const centre = await this.centreService.update(request.user.user.id, data);
    return new CentreDto(centre);
  }
}
