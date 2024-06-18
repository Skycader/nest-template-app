import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: './database/db.sql',
  //database: __dirname + '/database/db.sql',
  //  entities: ['/dist/']
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: false,
  // entities: ['src/entity/*.ts', './build/src/entity/*.js'], // <- Here!
  // entities: [Todo],
  // migrations: [__dirname + '/migrations'],
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
