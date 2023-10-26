import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Booking } from './booking.entity';

@Entity()
export class Payment extends AbstractEntity {
  @Column({ type: 'uuid' })
  bookingId: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  discount?: number;

  @Column({ nullable: true })
  extraCharge?: string;

  @Column()
  paymentType: string;

  @JoinColumn({ name: 'bookingId' })
  @ManyToOne(() => Booking, (b) => b.payment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  booking: Promise<Booking>;
}
