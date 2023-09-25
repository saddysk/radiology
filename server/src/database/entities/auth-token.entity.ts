import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

@Entity()
export class AuthToken extends AbstractEntity {
  @Column()
  hash: string;

  @Column()
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: Promise<User>;

  @Column({ nullable: true })
  lastUsedAt?: Date;

  constructor(authToken?: Partial<AuthToken>) {
    super();

    if (authToken) {
      Object.assign(this, authToken);
    }
  }
}
