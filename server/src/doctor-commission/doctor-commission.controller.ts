import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorCommissionService } from './services/doctor-commission.service';
import {
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import {
  CreateDoctorCommissionDto,
  DoctorCommissionDto,
  UpdateDoctorCommissionDto,
} from './dto/doctor-commission.dto';

@Controller('api/doctor-commission')
@ApiTags('DoctorCommission')
export class DoctorCommissionController {
  constructor(
    private readonly doctorCommissionService: DoctorCommissionService,
  ) {}

  @PostRoute('', {
    Ok: { dtoType: 'ArrayDto', type: DoctorCommissionDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async add(
    @Req() request: any,
    @Body() data: CreateDoctorCommissionDto,
  ): Promise<DoctorCommissionDto[]> {
    const commissions = await this.doctorCommissionService.add(
      request.user.user.id,
      data,
    );

    return commissions.map((commission) => new DoctorCommissionDto(commission));
  }

  @GetRoute(':id', {
    Ok: DoctorCommissionDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Param('id') id: string): Promise<DoctorCommissionDto> {
    const commission = await this.doctorCommissionService.get(id);

    return new DoctorCommissionDto(commission);
  }

  @GetRoute(':centreId/doctor/:doctorId', {
    Ok: { dtoType: 'ArrayDto', type: DoctorCommissionDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAll(
    @Param('centreId') centreId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<DoctorCommissionDto[]> {
    const commissions = await this.doctorCommissionService.getAll(
      centreId,
      doctorId,
    );

    return commissions.map((commission) => new DoctorCommissionDto(commission));
  }

  @PutRoute('', {
    Ok: DoctorCommissionDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateDoctorCommissionDto,
  ): Promise<DoctorCommissionDto> {
    const commission = await this.doctorCommissionService.update(
      request.user.user.id,
      data,
    );

    return new DoctorCommissionDto(commission);
  }
}
