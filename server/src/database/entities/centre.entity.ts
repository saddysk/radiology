import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IAddress } from '../interfaces/address.interface';
import { CentreAdmin } from './centre-admin.entity';
import { DoctorCommission } from './doctor-commission.entity';
import { CentrePr } from './centre-pr.entity';

@Entity()
export class Centre extends AbstractEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  centreNumber?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'json' })
  address: IAddress;

  @OneToMany(() => CentreAdmin, (ca) => ca.centre)
  centreAdmin: Promise<CentreAdmin>;

  @OneToMany(() => CentrePr, (cp) => cp.centre)
  centrePr: Promise<CentrePr>;

  @OneToMany(() => DoctorCommission, (dc) => dc.centre)
  doctorCommission?: Promise<DoctorCommission>;
}
