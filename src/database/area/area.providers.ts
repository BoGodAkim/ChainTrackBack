import { DataSource } from 'typeorm';
import { Area } from './area.entity';

export const areaProviders = [
  {
    provide: 'AREA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Area),
    inject: ['DATA_SOURCE'],
  },
];
