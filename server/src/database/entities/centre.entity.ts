import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { IAddress } from '../interfaces/address.interface';
import { CentreAdmin } from './centre-admin.entity';
import { DoctorCommission } from './doctor-commission.entity';

@Entity()
export class Centre extends AbstractEntity {
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

  @OneToMany(() => DoctorCommission, (dc) => dc.centre)
  doctorCommission?: Promise<DoctorCommission>;
}
