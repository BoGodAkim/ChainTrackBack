import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../device/device.entity';
import { Circle, circleTransformer } from '../circle';

@Entity()
export class Coordinate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column({
    type: 'circle',
    transformer: circleTransformer,
  })
  coordinates: Circle;

  @Column()
  timestamp: Date;
}
