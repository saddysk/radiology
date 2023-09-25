import { isEmpty } from 'lodash';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AppConfig } from 'src/config/config';
import { AuthGuardOption } from 'libs/guards/auth.guard';

const CONFIG = AppConfig();

/**
 * Stretegy to secure internal endpoints
 */
@Injectable()
export class InternalStrategy extends PassportStrategy(
  Strategy,
  AuthGuardOption.INTERNAL,
) {
  constructor() {
    super();
  }

  async validate(plainToken: string): Promise<boolean> {
    if (isEmpty(plainToken)) {
      throw new UnauthorizedException('Token is missing');
    }

    if (CONFIG.INTERNAL_API_TOKEN !== plainToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
