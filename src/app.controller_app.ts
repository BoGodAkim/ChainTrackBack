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
import { DeviceService } from './database/device/device.service';
import { Device } from './database/device/device.entity';
import { Circle } from './database/circle';

@Controller('app')
export class AppControllerApp {
  constructor(
    private readonly alertService: AlertService,
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

}
