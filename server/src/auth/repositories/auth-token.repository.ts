import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { AuthToken } from 'src/database/entities/auth-token.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import { sub } from 'date-fns';
import { User } from 'src/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@DatabaseRepository(AuthToken)
export class AuthTokenRepository extends AbstractRepository<AuthToken> {
  async createAuthToken(
    authAccessToken: string,
    user: User,
    jwtService: JwtService,
  ): Promise<AuthToken> {
    const now = new Date();

    const authToken = new AuthToken();
    authToken.userId = user.id;
    authToken.createdAt = now;

    authToken.hash = await jwtService.signAsync({
      accessToken: authAccessToken,
    });

    return this.save(authToken, { reload: true });
  }

  /**
   * If token is valid it return the token else it return null
   * @param payload jwt token payload
   */
  async validateAndGetToken(token: AuthToken): Promise<AuthToken> {
    if (!token.id && !token.userId) {
      return null;
    }

    const now = new Date();

    const accessToken = await this.findOne({
      where: {
        id: token.id,
        userId: token.userId,
      },
    });

    if (!accessToken) {
      return null;
    }

    // If token access is not updated in last 30 minutes then update it again
    if (
      accessToken?.lastUsedAt == null ||
      accessToken.lastUsedAt < sub(now, { minutes: 30 })
    ) {
      accessToken.lastUsedAt = now;
      await this.update(accessToken.id, {
        lastUsedAt: accessToken.lastUsedAt,
      });
    }

    return accessToken;
  }

  async revokeToken(tokenId: string) {
    const token = await this.findOne({
      where: {
        id: tokenId,
      },
    });

    if (!token) {
      Logger.debug(`No valid token found, token id: ${tokenId}`);
      return;
    }

    return this.delete(token.id);
  }
}
