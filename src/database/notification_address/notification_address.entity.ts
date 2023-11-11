import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { Device } from '../device/device.entity';
import { circleTransformer, Circle } from '../circle';

@Entity()
export class NotificationAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Device, (device) => device.notificationAddresses)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column({
    type: 'circle',
    transformer: circleTransformer,
  })
  location: Circle;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  street: string;

  @Column()
  houseNumber: string;

  //TODO: add more fields
}
