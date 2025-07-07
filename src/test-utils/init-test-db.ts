import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export async function initTestDb() {
  const testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
  });
  await testDataSource.initialize();
  (AppDataSource as any).manager = testDataSource.manager;
  (AppDataSource as any).getRepository = testDataSource.getRepository.bind(testDataSource);
  (AppDataSource as any).initialized = true;
} 