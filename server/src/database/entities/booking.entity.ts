import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Patient } from './patient.entity';
import { IBookingRecord } from '../interfaces/booking.interface';

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

  @Column()
  amount: number;

  @Column({ nullable: true })
  discount?: number;

  @Column({ nullable: true })
  remark?: string;

  @Column({ nullable: true })
  extraCharge?: string;

  @Column()
  paymentType: string;

  @Column({ type: 'json', nullable: true })
  record?: IBookingRecord;

  @JoinColumn({ name: 'patientId' })
  @ManyToOne(() => Patient, (p) => p.booking, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  patient?: Promise<Patient>;
}
