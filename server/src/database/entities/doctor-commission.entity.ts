import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Centre } from './centre.entity';
import { User } from './user.entity';
import { LowerCaseTransformer } from '../transformers/lowercase';

@Entity()
export class DoctorCommission extends AbstractEntity {
  @Column({ type: 'uuid' })
  doctorId: string;

  @JoinColumn({ name: 'doctorId' })
  @ManyToOne(() => User, (u) => u.doctorCommission)
  doctor: Promise<User>;

  @Column({ type: 'uuid' })
  centreId: string;

  @JoinColumn({ name: 'centreId' })
  @ManyToOne(() => Centre, (c) => c.doctorCommission, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  centre: Promise<Centre>;

  @Column({
    transformer: LowerCaseTransformer,
  })
  modality: string;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: new Date('1970-01-01') })
  startDate: Date;

  @Column({ default: new Date('2030-12-31') })
  endDate: Date;
}
