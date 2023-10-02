import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Expense extends AbstractEntity {
  @Column({ type: 'uuid' })
  centreId: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column()
  expenseType: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  remark?: string;
}
