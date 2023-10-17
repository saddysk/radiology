import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRequestService } from './services/update-request.service';
import {
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import {
  CreateUpdateRequestDto,
  UpdateRequestDto,
} from './dto/update-request.dto';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { SuccessDto } from 'libs/dtos';
import { RequestStatus } from 'src/database/entities/update-request.entity';

@Controller('api/update-request')
@ApiTags('Update Request')
export class UpdateRequestController {
  constructor(private readonly updateRequestService: UpdateRequestService) {}

  @PostRoute('', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async save(
    @Req() request: any,
    @Body() data: CreateUpdateRequestDto,
  ): Promise<SuccessDto> {
    await this.updateRequestService.save(request.user.user.id, data);
    return new SuccessDto();
  }

  @GetRoute(':id', {
    Ok: UpdateRequestDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getById(
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<UpdateRequestDto> {
    const updateRequest = await this.updateRequestService.getById(
      request.user.user.id,
      id,
    );
    return new UpdateRequestDto(updateRequest);
  }

  @GetRoute(':centreId/centre', {
    Ok: { dtoType: 'ArrayDto', type: UpdateRequestDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(
    @Req() request: any,
    @Param('centreId') centreId: string,
  ): Promise<UpdateRequestDto[]> {
    const updateRequests = await this.updateRequestService.get(
      request.user.user.id,
      centreId,
    );
    return updateRequests.map(
      (updateRequest) => new UpdateRequestDto(updateRequest),
    );
  }

  @PutRoute(':id', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Query('status') status: RequestStatus,
  ): Promise<SuccessDto> {
    await this.updateRequestService.update(request.user.user.id, id, status);
    return new SuccessDto();
  }
}
