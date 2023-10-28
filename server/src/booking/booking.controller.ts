import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './services/booking.service';
import { BookingDto, CreateBookingDto } from './dto/booking.dto';
import {
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';
import { Booking } from 'src/database/entities/booking.entity';

@Controller('api/booking')
@ApiTags('Booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
    return BookingDto.toDto(booking);
  }

  @GetRoute(':id', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getById(@Param('id') id: string): Promise<BookingDto> {
    const booking = await this.bookingService.getById(id);
    return BookingDto.toDto(booking);
  }

  @GetRoute('centre/:centreId', {
    Ok: { dtoType: 'ArrayDto', type: BookingDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Param('centreId') centreId: string): Promise<BookingDto[]> {
    const bookings = await this.bookingService.get(centreId);
    return Promise.all(bookings.map((booking) => BookingDto.toDto(booking)));
  }

  @PutRoute('', {
    Ok: BookingDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: Booking,
  ): Promise<BookingDto> {
    const booking = await this.bookingService.update(
      request.user.user.id,
      data,
    );
    return BookingDto.toDto(booking);
  }
}
