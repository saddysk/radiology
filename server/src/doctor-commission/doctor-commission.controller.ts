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
  async getById(@Param('id') id: string): Promise<DoctorCommissionDto> {
    const commission = await this.doctorCommissionService.getById(id);

    return new DoctorCommissionDto(commission);
  }

  @GetRoute('centre/:centreId/all', {
    Ok: { dtoType: 'ArrayDto', type: DoctorCommissionDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAllDoctorsForCentre(
    @Param('centreId') centreId: string,
  ): Promise<DoctorCommissionDto[]> {
    const commissions =
      await this.doctorCommissionService.getAllDoctorsForCentre(centreId);

    return Promise.all(
      commissions.map((commission) =>
        DoctorCommissionDto.toDoctorDto(commission),
      ),
    );
  }

  @GetRoute('centres-by-doctor', {
    Ok: { dtoType: 'ArrayDto', type: DoctorCommissionDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getAllCentresForDoctor(
    @Req() request: any,
  ): Promise<DoctorCommissionDto[]> {
    const commissions =
      await this.doctorCommissionService.getAllCentresForDoctor(
        request.user.user.id,
      );

    return Promise.all(
      commissions.map((commission) =>
        DoctorCommissionDto.toCentreDto(commission),
      ),
    );
  }

  @GetRoute(':centreId/doctor/:doctorId', {
    Ok: { dtoType: 'ArrayDto', type: DoctorCommissionDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(
    @Param('centreId') centreId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<DoctorCommissionDto[]> {
    const commissions = await this.doctorCommissionService.get(
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
