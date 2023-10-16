import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { LowerCaseTransformer } from '../transformers/lowercase';
import { IAddress } from '../interfaces/address.interface';
import { Booking } from './booking.entity';

@Entity()
export class Patient extends AbstractEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  patientNumber?: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column({
    transformer: LowerCaseTransformer,
    nullable: true,
  })
  email?: string;

  @Column({ type: 'json', nullable: true })
  address?: IAddress;

  @Column({ nullable: true })
  abhaId?: string;

  @OneToMany(() => Booking, (b) => b.patient)
  booking?: Promise<Booking[]>;
}
