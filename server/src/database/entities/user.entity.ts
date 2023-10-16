import { Column, Entity, Index, OneToMany } from 'typeorm';
import { LowerCaseTransformer } from '../transformers/lowercase';
import { AbstractEntity } from './abstract.entity';
import { CentreAdmin } from './centre-admin.entity';
import { DoctorCommission } from './doctor-commission.entity';

export enum UserRole {
  Admin = 'admin',
  Receptionist = 'receptionist',
  Pr = 'pr',
  Doctor = 'doctor',
}

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

  @OneToMany(() => CentreAdmin, (ca) => ca.user)
  centreAdmin: Promise<CentreAdmin>;

  @OneToMany(() => DoctorCommission, (dc) => dc.doctor)
  doctorCommission?: Promise<DoctorCommission>;
}
