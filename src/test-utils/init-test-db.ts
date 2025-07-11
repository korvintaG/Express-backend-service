import { DataSource, EntityTarget, Repository } from 'typeorm';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

// Интерфейс для тестового DataSource
interface TestDataSource extends DataSource {
  manager: DataSource['manager'];
  getRepository<T>(target: EntityTarget<T>): Repository<T>;
  initialized: boolean;
}

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
  
  // Используем правильную типизацию вместо any
  (AppDataSource as TestDataSource).manager = testDataSource.manager;
  (AppDataSource as TestDataSource).getRepository = testDataSource.getRepository.bind(testDataSource);
  (AppDataSource as TestDataSource).initialized = true;
} 