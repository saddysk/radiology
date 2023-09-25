import { Column, Entity, Index } from 'typeorm';
import { LowerCaseTransformer } from '../transformers/lowercase';
import { AbstractEntity } from './abstract.entity';
import { UserRole } from '../enums/user.enum';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    transformer: LowerCaseTransformer,
  })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  centerId?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;
}
