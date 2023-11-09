import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Dingding extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  workDate: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  rest: number;
}
