import { DataSource } from 'typeorm';
import { NotificationAddress } from './notification_address.entity';

export const notificationAddressProviders = [
  {
    provide: 'NOTIFICATION_ADDRESS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NotificationAddress),
    inject: ['DATA_SOURCE'],
  },
];
