import { PickType } from '@nestjs/swagger';
import {
  BooleanFieldOptional,
  EmailField,
  EnumField,
  ObjectField,
  PasswordField,
  StringField,
  StringFieldOptional,
  UUIDField,
  UUIDFieldOptional,
} from 'libs/decorators';
import { IAuthUser } from 'libs/interfaces/auth-user.interface';
import { User, UserRole } from 'src/database/entities/user.entity';

export class UserDto {
  @UUIDField()
  id: string;

  @StringField()
  name: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @UUIDFieldOptional()
  centreId?: string;

  @EnumField(() => UserRole)
  role: UserRole;

  @BooleanFieldOptional()
  isFirstLogin?: boolean;

  constructor(user?: User) {
    if (user == null) {
      return;
    }

    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.isFirstLogin = user.isFirstLogin;
    this.centreId = user.centreId;
  }
}

export class AuthUserDto {
  @ObjectField(() => UserDto)
  user: UserDto;

  @StringField()
  token: string;

  constructor(authUser?: IAuthUser) {
    this.user = new UserDto(authUser.user);
    this.token = authUser.token.hash;
  }
}

export class CreateUserDto extends PickType(UserDto, [
  'name',
  'email',
  'password',
  'role',
  'centreId',
]) {}

export class LoginUserDto extends PickType(UserDto, ['email', 'password']) {}

export class ResetPasswordDto extends PickType(UserDto, ['email']) {
  @PasswordField()
  newPassword: string;
}

export class UpdateUserDto {
  @StringFieldOptional()
  name?: string;
}
