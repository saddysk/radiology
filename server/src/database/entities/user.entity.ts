import { Column, Entity, Index, OneToMany } from 'typeorm';
import { LowerCaseTransformer } from '../transformers/lowercase';
import { AbstractEntity } from './abstract.entity';
import { UserRole } from '../enums/user.enum';
import { CentreAdmin } from './centre-admin.entity';

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

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  centreId?: string;

  @OneToMany(() => CentreAdmin, (uc) => uc.user)
  centreAdmin: Promise<CentreAdmin>;
}
