import { DeleteDateColumn, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export class AbstractSoftEntity extends AbstractEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}
