import { Module } from '@nestjs/common';
import { notificationsProviders } from './notifications.provider';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [...notificationsProviders, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
