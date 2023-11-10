import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientService } from './services/patient.service';
import { GetRoute, PutRoute } from 'libs/decorators/route.decorators';
import { PatientDto, UpdatePatientDto } from './dto/patient.dto';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';

@Controller('api/patient')
@ApiTags('Patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @GetRoute('', {
    Ok: { dtoType: 'ArrayDto', type: PatientDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Query('centreId') centreId: string): Promise<PatientDto[]> {
    const patients = await this.patientService.get(centreId);
    return Promise.all(patients.map((patient) => new PatientDto(patient)));
  }

  @GetRoute('get-by-patient-number', {
    Ok: PatientDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getByPatientNumber(
    @Query('patientNumber') patientNumber: string,
  ): Promise<PatientDto> {
    const patient = await this.patientService.getByPatientNumber(patientNumber);
    return new PatientDto(patient);
  }

  @GetRoute(':id', {
    Ok: PatientDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getById(@Param(':id') id: string): Promise<PatientDto> {
    const patient = await this.patientService.getById(id);
    return new PatientDto(patient);
  }

  @PutRoute('', {
    Ok: PatientDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdatePatientDto,
  ): Promise<PatientDto> {
    const patient = await this.patientService.update(
      request.user.user.id,
      data,
    );
    return new PatientDto(patient);
  }
}
