import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { alertProviders } from './alert/alert.providers';
import { areaProviders } from './area/area.providers';
import { coordinateProviders } from './coordinate/coordinate.providers';
import { deviceProviders } from './device/device.provider';
import { notificationProviders } from './notification/notification.providers';
import { notificationAddressProviders } from './notification_address/notification_address.providers';
import { AlertService } from './alert/alert.service';
import { AreaService } from './area/area.service';
import { CoordinateService } from './coordinate/coordinate.service';
import { DeviceService } from './device/device.service';
import { NotificationService } from './notification/notification.service';
import { NotificationAddressService } from './notification_address/notification_address.service';

@Module({
  providers: [
    ...databaseProviders,
    ...alertProviders,
    ...areaProviders,
    ...coordinateProviders,
    ...deviceProviders,
    ...notificationProviders,
    ...notificationAddressProviders,
    AlertService,
    AreaService,
    CoordinateService,
    DeviceService,
    NotificationService,
    NotificationAddressService,
  ],
  exports: [
    AlertService,
    AreaService,
    CoordinateService,
    DeviceService,
    NotificationService,
    NotificationAddressService,
  ],
})
export class DatabaseModule {}
