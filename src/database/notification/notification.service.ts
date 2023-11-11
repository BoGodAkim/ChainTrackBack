import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Alert } from '../alert/alert.entity';
import { AlertService } from '../alert/alert.service';
import { NotificationAddressService } from '../notification_address/notification_address.service';
import { NotificationAddress } from '../notification_address/notification_address.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    private readonly alertService: AlertService,
    private readonly notificationAddressService: NotificationAddressService,
  ) {}

  async createNotifications(alert: Alert): Promise<Notification[]> {
    let notifications: Notification[] = [];
    let notificationAddressesIds: Set<NotificationAddress> = new Set();
    alert.areas.forEach(async (area) => {
      notificationAddressesIds = new Set([
        ...notificationAddressesIds,
        ...(await this.notificationAddressService.findAllInCircle(area)),
        ...(await this.notificationAddressService.findAllInPolygon(area)),
        ...(await this.notificationAddressService.findAllByAddress(area)),
      ]);
    });
    notificationAddressesIds.forEach(async (notificationAddress) => {
      const notification = new Notification();
      notification.alert = alert;
      notification.device = notificationAddress.device;
      notification.title = 'Miscellaneous';
      notification.body = alert.description;
      notifications.push(notification);
    });
    await this.notificationRepository.save(notifications);
    return notifications;
  }
}
