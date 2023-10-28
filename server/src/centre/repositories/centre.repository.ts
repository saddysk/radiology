import { Logger } from '@nestjs/common';
import { IRetryContext } from 'cockatiel';
import { createHash } from 'crypto';
import { toBase34x } from 'libs/helpers/generator.helper';
import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Centre } from 'src/database/entities/centre.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import { handleUniqueConstraint } from 'src/patient/repositories/patient.repository';

@DatabaseRepository(Centre)
export class CentreRepository extends AbstractRepository<Centre> {
  async generateCentreNumber(centre: Centre): Promise<Centre> {
    if (centre.centreNumber != null) {
      Logger.warn(
        `Customer ${centre.id} already has a number. Skipping number generation.`,
      );
      return centre;
    }

    const onFailure = handleUniqueConstraint.onFailure(() => {
      Logger.warn(
        `Customer ${centre.id} number generation failed due to unique key violation. Retrying...`,
        CentreRepository.name,
      );
    });

    const onGiveup = handleUniqueConstraint.onGiveUp(() => {
      Logger.error(
        `Failed to generate centre number for centre id ${centre.id}`,
        null,
        CentreRepository.name,
      );
    });

    onFailure.dispose();
    onGiveup.dispose();

    return handleUniqueConstraint.execute(async (context: IRetryContext) => {
      const hash = toBase34x(createHash('sha256').update(centre.id).digest());

      centre.centreNumber =
        'C_' + hash.slice(0, 5) + hash.charAt(5 + context.attempt - 1);

      await this.update(
        {
          id: centre.id,
        },
        { centreNumber: centre.centreNumber },
      );

      return centre;
    });
  }
}
