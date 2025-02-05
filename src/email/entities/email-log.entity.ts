import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { EEmailStatus } from '../types/email-status.enum';

@Entity('email_logs')
export class EmailLog extends BaseEntity {
  @Column()
  to: string;

  @Column()
  subject: string;

  @Column('text')
  text: string;

  @Column({ type: 'enum', enum: EEmailStatus, default: EEmailStatus.CREATED })
  status: string;

  @Column({ nullable: true })
  errorMessage?: string;
}
