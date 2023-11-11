import { Inject, Injectable } from '@nestjs/common';
import { NotificationAddress } from './notification_address.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { Area } from '../area/area.entity';

@Injectable()
export class NotificationAddressService {
  constructor(
    @Inject('NOTIFICATION_ADDRESS_REPOSITORY')
    private notificationAddressRepository: Repository<NotificationAddress>,
  ) {}

  async findAllInCircle(area: Area): Promise<NotificationAddress[]> {
    if (area.circle == null) {
      return [];
    }
    return await this.notificationAddressRepository
      .createQueryBuilder()
      .where('point(location) <@ :circle', { circle: area.circle })
      .getMany();
  }

  async findAllInPolygon(area: Area): Promise<NotificationAddress[]> {
    if (area.polygon == null) {
      return [];
    }
    return await this.notificationAddressRepository
      .createQueryBuilder()
      .where('point(location) <@ :polygon', { polygon: area.polygon })
      .getMany();
  }

  async findAllByAddress(area: Area): Promise<NotificationAddress[]> {
    if (area.country == null || area.city == null) {
      return [];
    }
    let query = this.notificationAddressRepository
      .createQueryBuilder()
      .where('country = :country', { country: area.country })
      .andWhere('city = :city', { city: area.city });
    if (area.postalCode != null) {
      query = query.andWhere('postalCode = :postalCode', {
        postalCode: area.postalCode,
      });
    }
    if (area.street != null) {
      query = query.andWhere('street = :street', { street: area.street });
    }
    if (area.houseNumber != null) {
      query = query.andWhere('houseNumber = :houseNumber', {
        houseNumber: area.houseNumber,
      });
    }

    return await query.getMany();
  }

  async create(
    notificationAddress: NotificationAddress,
  ): Promise<NotificationAddress> {
    return this.notificationAddressRepository.save(notificationAddress);
  }

  async findAll(): Promise<NotificationAddress[]> {
    return this.notificationAddressRepository.find();
  }

  async update(
    notificationAddress: NotificationAddress,
  ): Promise<NotificationAddress> {
    return this.notificationAddressRepository.save(notificationAddress);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.notificationAddressRepository.delete({ id: id });
  }

  async findOne(id: number): Promise<NotificationAddress> {
    return this.notificationAddressRepository.findOneBy({ id: id });
  }
}
