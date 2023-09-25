import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../services/auth.service';
import { IAuthUser } from 'libs/interfaces/auth-user.interface';
import { AuthGuardOption } from 'libs/guards/auth.guard';

@Injectable()
export class BearerStrategy extends PassportStrategy(
  Strategy,
  AuthGuardOption.BEARER,
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(plainToken: string): Promise<IAuthUser> {
    const token = await this.authService.validateUserByToken(plainToken);

    const user = await token.user;

    return { user, token };
  }
}
