import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Area } from '../area/area.entity';
import { Notification } from '../notification/notification.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isUrgent: boolean;

  @Column()
  categoryId: number;

  @Column()
  dateOfCreation: Date;

  @Column()
  dateOfStart: Date;

  @Column()
  dateOfEnd: Date;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @OneToMany(() => Area, (area) => area.alert)
  areas: Area[];

  @OneToMany(() => Notification, (notification) => notification.alert)
  notifications: Notification[];

  //TODO: add foreign typeofalert
}
