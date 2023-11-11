import { DataSource } from 'typeorm';
import { alertProviders } from './alert/alert.providers';
import { areaProviders } from './area/area.providers';
import { coordinateProviders } from './coordinate/coordinate.providers';
import { deviceProviders } from './device/device.provider';
import { notificationProviders } from './notification/notification.providers';
import { notificationAddressProviders } from './notification_address/notification_address.providers';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '13102003',
        database: 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
  // ...alertProviders,
  // ...areaProviders,
  // ...coordinateProviders,
  // ...deviceProviders,
  // ...notificationProviders,
  // ...notificationAddressProviders,
];
