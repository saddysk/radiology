import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './services/booking.service';
import {
  BookingDto,
  CreateBookingDto,
  UpdateBookingDto,
  UploadRecordDto,
} from './dto/booking.dto';
import {
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { CentreService } from 'src/centre/services/centre.service';
import { SuccessDto } from 'libs/dtos';

@Controller('api/booking')
@ApiTags('Booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly authService: AuthService,
    private readonly centreService: CentreService,
  ) {}

  @PostRoute('', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async create(
    @Req() request: any,
    @Body() data: CreateBookingDto,
  ): Promise<BookingDto> {
    const booking = await this.bookingService.create(
      request.user.user.id,
      data,
    );
    return BookingDto.toDto(booking, this.authService);
  }

  // TODO: only for migration
  @PostRoute('migration', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async migration(@Req() request: any, @Body() data: any): Promise<SuccessDto> {
    await this.bookingService.migration(request.user.user.id, data);
    return new SuccessDto();
  }

  @GetRoute('referrals', { Ok: { dtoType: 'ArrayDto', type: BookingDto } })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getDoctorReferrals(
    @Req() request: any,
    @Query('doctorId') doctorId?: string,
  ): Promise<BookingDto[]> {
    const id = doctorId || request.user.user.id;
    const bookings = await this.bookingService.getDoctoReferrals(id);
    return Promise.all(
      bookings.map((booking) =>
        BookingDto.toDto(booking, this.authService, this.centreService),
      ),
    );
  }

  @GetRoute(':id', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getById(@Param('id') id: string): Promise<BookingDto> {
    const booking = await this.bookingService.getById(id);
    return BookingDto.toDto(booking, this.authService);
  }

  @GetRoute('centre/:centreId', {
    Ok: { dtoType: 'ArrayDto', type: BookingDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Param('centreId') centreId: string): Promise<BookingDto[]> {
    const bookings = await this.bookingService.get(centreId);
    return Promise.all(
      bookings.map((booking) => BookingDto.toDto(booking, this.authService)),
    );
  }

  @PutRoute('', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateBookingDto,
  ): Promise<BookingDto> {
    const booking = await this.bookingService.update(
      request.user.user.id,
      data,
    );
    return BookingDto.toDto(booking, this.authService);
  }

  @PutRoute('upload-record', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async uploadRecord(@Body() data: UploadRecordDto): Promise<BookingDto> {
    const booking = await this.bookingService.uploadRecord(data);
    return BookingDto.toDto(booking);
  }
}
