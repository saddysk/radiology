import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IInvestigation } from '../interfaces/rate-list.interface';
import { LowerCaseTransformer } from '../transformers/lowercase';

@Entity()
export class RateList extends AbstractEntity {
  @Column({ type: 'uuid' })
  centreId: string;

  @Column({
    transformer: LowerCaseTransformer,
  })
  modality: string;

  @Column({ type: 'json' })
  investigation: IInvestigation[];
}
