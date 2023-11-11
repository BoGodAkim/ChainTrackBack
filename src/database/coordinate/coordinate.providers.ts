import { DataSource } from 'typeorm';
import { Coordinate } from './coordinate.entity';

export const coordinateProviders = [
  {
    provide: 'COORDINATE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Coordinate),
    inject: ['DATA_SOURCE'],
  },
];
