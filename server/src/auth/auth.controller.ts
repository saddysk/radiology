import { Body, Controller, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteRoute, PostRoute } from 'libs/decorators/route.decorators';
import { AuthUserDto, CreateUserDto, LoginUserDto } from './dto/user.dto';
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

  @PostRoute('login', {
    Ok: AuthUserDto,
  })
  async login(@Body() data: LoginUserDto): Promise<AuthUserDto> {
    const authUser = await this.authService.login(data);

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
