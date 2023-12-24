import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class AttendanceReport extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamptz' })
  workDate: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rest: number;
}
