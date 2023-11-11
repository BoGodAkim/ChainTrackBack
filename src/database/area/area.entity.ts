import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Polygon,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Circle, circleTransformer } from '../circle';
import { Alert } from '../alert/alert.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'polygon',
    nullable: true,
  })
  polygon: Polygon;

  @Column({
    type: 'circle',
    nullable: true,
    transformer: circleTransformer,
  })
  circle: Circle;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  postalCode: string;

  @Column({
    nullable: true,
  })
  street: string;

  @Column({
    nullable: true,
  })
  houseNumber: string;

  @ManyToOne(() => Alert, (alert) => alert.areas)
  @JoinColumn({ name: 'alert_id' })
  alert: Alert;
}
