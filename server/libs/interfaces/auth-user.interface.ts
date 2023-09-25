import { AuthToken } from 'src/database/entities/auth-token.entity';
import { User } from 'src/database/entities/user.entity';

export interface IAuthUser {
  token: AuthToken;
  user: User;
}
