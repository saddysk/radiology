import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Patient } from './patient.entity';
import { IBookingRecord } from '../interfaces/booking.interface';
import { Payment } from './payment.entity';

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
  record?: IBookingRecord;

  @OneToMany(() => Payment, (p) => p.booking)
  payment?: Promise<Payment[]>;

  @JoinColumn({ name: 'patientId' })
  @ManyToOne(() => Patient, (p) => p.booking, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  patient?: Promise<Patient>;
}
