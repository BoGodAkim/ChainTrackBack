import { Module } from '@nestjs/common';
import { AppControllerApp } from './app.controller_app';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppControllerAdmin } from './app.controller_admin';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  controllers: [AppControllerApp, AppControllerAdmin],
  providers: [AppService],
})
export class AppModule {}
