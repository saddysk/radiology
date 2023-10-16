import { Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { toBase34x } from 'libs/helpers/generator.helper';
import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Patient } from 'src/database/entities/patient.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import {
  ExponentialBackoff,
  IRetryContext,
  handleWhen,
  retry,
} from 'cockatiel';

const onUniqueConstraint = handleWhen((e: any) => e.code === '23505');

const handleUniqueConstraint = retry(onUniqueConstraint, {
  maxAttempts: 10,
  backoff: new ExponentialBackoff({
    maxDelay: 10 * 1000, // 10 seconds
  }),
});

@DatabaseRepository(Patient)
export class PatientRepository extends AbstractRepository<Patient> {
  async generatePatientNumber(patient: Patient): Promise<Patient> {
    if (patient.patientNumber != null) {
      Logger.warn(
        `Customer ${patient.id} already has a number. Skipping number generation.`,
      );
      return patient;
    }

    const onFailure = handleUniqueConstraint.onFailure(() => {
      Logger.warn(
        `Customer ${patient.id} number generation failed due to unique key violation. Retrying...`,
        PatientRepository.name,
      );
    });

    const onGiveup = handleUniqueConstraint.onGiveUp(() => {
      Logger.error(
        `Failed to generate patient number for patient id ${patient.id}`,
        null,
        PatientRepository.name,
      );
    });

    onFailure.dispose();
    onGiveup.dispose();

    return handleUniqueConstraint.execute(async (context: IRetryContext) => {
      const hash = toBase34x(createHash('sha256').update(patient.id).digest());

      patient.patientNumber =
        hash.slice(0, 5) + hash.charAt(5 + context.attempt - 1);

      await this.update(
        {
          id: patient.id,
        },
        { patientNumber: patient.patientNumber },
      );

      return patient;
    });
  }
}
