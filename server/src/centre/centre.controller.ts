import { Body, Controller, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CentreService } from './services/centre.service';
import { PostRoute } from 'libs/decorators/route.decorators';
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
    const centre = await this.centreService.create(request.user.id, data);

    return new CentreDto(centre);
  }
}
