import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CentreService } from './services/centre.service';
import { GetRoute, PostRoute } from 'libs/decorators/route.decorators';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { CentreDto, CreateCentreDto } from './dto/centre.dto';

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

  @GetRoute('', {
    Ok: { dtoType: 'ArrayDto', type: CentreDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAll(@Req() request: any): Promise<CentreDto[]> {
    const centres = await this.centreService.getAll(request.user.user.id);

    return centres.map((centre) => new CentreDto(centre));
  }

  @GetRoute('all', {
    Ok: { dtoType: 'ArrayDto', type: CentreDto },
  })
  async getCentres(): Promise<CentreDto[]> {
    const centres = await this.centreService.getCentres();

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
}
