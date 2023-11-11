import { Inject, Injectable } from '@nestjs/common';
import { Alert } from './alert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
  constructor(
    @Inject('ALERT_REPOSITORY')
    private alertRepository: Repository<Alert>,
  ) {}

  async create(alert: Alert): Promise<Alert> {
    return this.alertRepository.save(alert);
  }

  async findAll(): Promise<Alert[]> {
    return this.alertRepository.find({ relations: ['areas'] });
  }

  async update(alert: Alert): Promise<Alert> {
    return this.alertRepository.save(alert);
  }

  async findOne(id: number): Promise<Alert> {
    return this.alertRepository.findOne({
      where: { id: id },
      relations: ['areas'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.alertRepository.delete(id);
  }
}
