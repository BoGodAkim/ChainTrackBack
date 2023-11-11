import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlertService } from './database/alert/alert.service';
import { Alert } from './database/alert/alert.entity';
import { Device } from './database/device/device.entity';
import { DeviceService } from './database/device/device.service';
import { NotificationService } from './database/notification/notification.service';
import { NotificationsService } from './notifications/notifications.service';

@Controller('admin')
export class AppControllerAdmin {
  constructor(
    private readonly alertService: AlertService,
    private readonly deviceService: DeviceService,
    private readonly notificationService: NotificationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('/alert')
  async addAlert(@Body() alert: Alert): Promise<void> {
    alert = await this.alertService.create(alert);
    const notifications = await this.notificationService.createNotifications(
      alert,
    );
    await this.notificationsService.sendMessages(notifications);
  }

  @Put('/alert/:alertId')
  async updateAlert(
    @Param('alertId') alertId: number,
    @Body() alert: Alert,
  ): Promise<void> {
    alert.id = alertId;
    await this.alertService.update(alert);
  }

  @Delete('/alert/:id')
  async deleteAlert(@Param('id') id: number): Promise<void> {
    await this.alertService.delete(id);
  }

  @Get('/alerts')
  getAllAlerts(): Promise<Alert[]> {
    return this.alertService.findAll();
  }

  @Get('/allDeviceLocations')
  async getAllDeviceLocations(): Promise<Device[]> {
    return this.deviceService.findAll();
  }
}
