import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlertService } from './database/alert/alert.service';
import { NotificationAddressService } from './database/notification_address/notification_address.service';
import { DeviceService } from './database/device/device.service';
import { NotificationAddress } from './database/notification_address/notification_address.entity';
import { Device } from './database/device/device.entity';
import { Circle } from './database/circle';
import { Notification } from './database/notification/notification.entity';

@Controller('app')
export class AppControllerApp {
  constructor(
    private readonly alertService: AlertService,
    private readonly notificationAddressService: NotificationAddressService,
    private readonly deviceService: DeviceService,
  ) {}

  private async checkDevice(id: string): Promise<boolean> {
    const device = await this.deviceService.findOne(id);
    return device != null;
  }

  @Get('/id/:fcmToken')
  async getId(@Param('fcmToken') fcmToken: string): Promise<string> {
    const uuid = randomUUID();
    const device = new Device();
    device.id = uuid;
    device.fcmToken = fcmToken;
    await this.deviceService.create(device);
    return uuid;
  }

  @Get('/:id/myAddresses')
  async getMyAddresses(
    @Param('id') id: string,
  ): Promise<NotificationAddress[]> {
    if (!(await this.checkDevice(id))) {
      return;
    }

    return (await this.deviceService.findOne(id)).notificationAddresses;
  }

  @Post('/:id/address')
  async addAddress(
    @Param('id') id: string,
    @Body() address: NotificationAddress,
  ): Promise<void> {
    if (!(await this.checkDevice(id))) {
      return;
    }
    await this.notificationAddressService.create(address);
  }

  @Delete('/:id/address/:addressId')
  async deleteAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: number,
  ): Promise<void> {
    if (!(await this.checkDevice(id))) {
      return;
    }
    await this.notificationAddressService.delete(addressId);
  }

  @Put('/:id/address/:addressId')
  async updateAddress(
    @Param('id') id: string,
    @Param() addressId: number,
    @Body() address: NotificationAddress,
  ): Promise<void> {
    if (!(await this.checkDevice(id))) {
      return;
    }
    address.id = addressId;
    await this.notificationAddressService.update(address);
  }

  @Put('/:id/updateLocation')
  async shareLocation(
    @Param('id') id: string,
    @Body() location: Circle,
  ): Promise<void> {
    if (!(await this.checkDevice(id))) {
      return;
    }
    await this.deviceService.updateLocation(id, location);
  }

  @Get('/:id/notification')
  async getMyNotifications(@Param('id') id: string): Promise<Notification[]> {
    if (!(await this.checkDevice(id))) {
      return;
    }
    return (await this.deviceService.findOne(id)).notifications;
  }
}
