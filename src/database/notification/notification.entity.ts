import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Device } from '../device/device.entity';
import { Alert } from '../alert/alert.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Device, (device) => device.notificationAddresses)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ManyToOne(() => Alert, (alert) => alert.notifications)
  @JoinColumn({ name: 'alert_id' })
  alert: Alert;

  @Column()
  title: string;

  @Column()
  body: string;
}
