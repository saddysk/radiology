import { Body, Controller, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DeleteRoute,
  GetRoute,
  PostRoute,
  PutRoute,
} from 'libs/decorators/route.decorators';
import {
  AuthUserDto,
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserDto,
} from './dto/user.dto';
import { AuthService } from './services/auth.service';
import { SuccessDto } from 'libs/dtos';
import { AuthGuardOption, UseAuthGuard } from 'libs/guards/auth.guard';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostRoute('', {
    Ok: AuthUserDto,
  })
  async register(@Body() data: CreateUserDto): Promise<AuthUserDto> {
    const authUser = await this.authService.create(data);
    return new AuthUserDto(authUser);
  }

  @GetRoute('', {
    Ok: UserDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async get(@Req() request: any): Promise<UserDto> {
    const user = await this.authService.get(request.user.user.id);
    return new UserDto(user);
  }

  @GetRoute('all-doctors', {
    Ok: { dtoType: 'ArrayDto', type: UserDto },
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async getDoctors(): Promise<UserDto[]> {
    const doctors = await this.authService.getDoctors();
    return doctors.map((doctor) => new UserDto(doctor));
  }

  @GetRoute(':id', {
    Ok: UserDto,
  })
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.authService.get(id);
    return new UserDto(user);
  }

  @PostRoute('login', {
    Ok: AuthUserDto,
  })
  async login(@Body() data: LoginUserDto): Promise<AuthUserDto> {
    const authUser = await this.authService.login(data);
    return new AuthUserDto(authUser);
  }

  @PutRoute('', {
    Ok: UserDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async update(
    @Req() request: any,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.authService.update(request.user.user.id, data);
    return new UserDto(user);
  }

  @PutRoute('reset-password', {
    Ok: AuthUserDto,
  })
  async resetPassword(@Body() data: ResetPasswordDto): Promise<AuthUserDto> {
    const authUser = await this.authService.resetPassword(data);
    return new AuthUserDto(authUser);
  }

  @DeleteRoute('', {
    Ok: SuccessDto,
  })
  @UseAuthGuard(AuthGuardOption.BEARER)
  async logout(@Req() request: any): Promise<SuccessDto> {
    await this.authService.logout(request.user.token.id);
    return new SuccessDto();
  }
}
