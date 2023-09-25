import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Centre } from './centre.entity';
import { User } from './user.entity';

@Entity()
export class CentreUser extends AbstractEntity {
  @Column('uuid')
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (u) => u.centreUser)
  user: Promise<User>;

  @Column('uuid')
  centreId: string;

  @JoinColumn({ name: 'centreId' })
  @ManyToOne(() => Centre, (c) => c.centreUser)
  centre: Promise<Centre>;
}
