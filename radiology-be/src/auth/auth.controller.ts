import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostRoute } from 'libs/decorators/route.decorators';
import { AuthUserDto, CreateUserDto, LoginUserDto } from './dto/user.dto';
import { AuthService } from './services/auth.service';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  private readonly authService: AuthService;

  @PostRoute('', {
    Ok: AuthUserDto,
  })
  async register(@Body() data: CreateUserDto): Promise<AuthUserDto> {
    const authUser = await this.authService.create(data);

    return new AuthUserDto(authUser);
  }

  @PostRoute('', {
    Ok: AuthUserDto,
  })
  async login(@Body() data: LoginUserDto): Promise<AuthUserDto> {
    const authUser = await this.authService.login(data);

    return new AuthUserDto(authUser);
  }
}
