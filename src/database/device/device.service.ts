import { Inject, Injectable, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { Circle } from '../circle';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('DEVICE_REPOSITORY')
    private deviceRepository: Repository<Device>,
  ) {}

  async create(device: Device): Promise<Device> {
    return this.deviceRepository.save(device);
  }

  async findOne(@Param() id: string): Promise<Device> {
    return this.deviceRepository.findOne({
      where: { id: id },
      relations: { notificationAddresses: true, notifications: true },
    });
    //return this.deviceRepository.findOneBy({ id: id, relations: {notificationAddresses:true}});
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async updateLocation(id: string, location: Circle): Promise<void> {
    const device = await this.deviceRepository.findOneBy({ id: id });
    device.lastCoordinates = location;
    device.timestamp = new Date();
    await this.deviceRepository.save(device);
  }
}
