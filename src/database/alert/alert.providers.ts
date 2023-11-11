import { DataSource } from 'typeorm';
import { Alert } from './alert.entity';

export const alertProviders = [
  {
    provide: 'ALERT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Alert),
    inject: ['DATA_SOURCE'],
  },
];
