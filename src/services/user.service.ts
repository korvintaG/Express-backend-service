import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entity/User';
import { Repository } from 'typeorm';

// Интерфейс для JWT payload
interface JWTPayload {
  id: string;
  role: string;
}

export class UserService {
  static userRepo: Repository<User> = AppDataSource.getRepository(User);

  static async getById(id: string, currentUser: JWTPayload) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new Error('Forbidden');
    }
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new Error('User not found');
    // Удаляем поле password типобезопасно
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getAll() {
    return this.userRepo.find({ select: ['id', 'fullName', 'birthDate', 'email', 'role', 'isActive'] });
  }

  static async block(id: string, currentUser: JWTPayload) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new Error('Forbidden');
    }
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new Error('User not found');
    user.isActive = false;
    await this.userRepo.save(user);
    // Удаляем поле password типобезопасно
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async promote(id: string, currentUser: JWTPayload) {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Only admin can promote users');
    }
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new Error('User not found');
    if (user.role === UserRole.ADMIN) throw new Error('User is already admin');
    user.role = UserRole.ADMIN;
    await this.userRepo.save(user);
    // Удаляем поле password типобезопасно
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 