import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Patient } from './patient.entity';
import { Payment } from './payment.entity';
import { StorageFileTypes } from 'src/storage/services/storage.service';

@Entity()
export class Booking extends AbstractEntity {
  @Column({ type: 'uuid' })
  centreId: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid' })
  submittedBy: string;

  @Column({ type: 'uuid' })
  consultant: string;

  @Column()
  modality: string;

  @Column()
  investigation: string;

  @Column({ nullable: true })
  remark?: string;

  @Column({ type: 'json', nullable: true })
  records?: IBookingRecord[];

  @Column({ nullable: true, default: 0 })
  referralAmount?: number;

  @Column({ nullable: true })
  referralAmount?: number;

  @Column({ nullable: true })
  totalAmount?: number;

  @OneToMany(() => Payment, (p) => p.booking)
  payment?: Promise<Payment[]>;

  @JoinColumn({ name: 'patientId' })
  @ManyToOne(() => Patient, (p) => p.booking, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  patient?: Promise<Patient>;
}

export interface IBookingRecord {
  url: string;
  type: StorageFileTypes;
}
