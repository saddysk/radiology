import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export enum AuthGuardOption {
  INTERNAL = 'internal',
  BEARER = 'bearer',
  LOCAL = 'local',
}

export function UseAuthGuard(startegy: AuthGuardOption): MethodDecorator {
  return UseGuards(AuthGuard(startegy));
}
