import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entity/User';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { Repository } from 'typeorm';

export class AuthService {
  static userRepo: Repository<User> = AppDataSource.getRepository(User);

  static async register(dto: RegisterDto & { role?: string }) {
    if (dto.role && dto.role.toLowerCase() === 'admin') {
      console.warn(`Suspicious registration attempt with admin role: email=${dto.email}`);
    }
    const exists = await this.userRepo.findOneBy({ email: dto.email });
    if (exists) throw new Error('Email already in use');
    const user = this.userRepo.create({
      fullName: dto.fullName,
      birthDate: new Date(dto.birthDate),
      email: dto.email,
      password: await hashPassword(dto.password),
      role: UserRole.USER, // всегда user
      isActive: true,
    });
    await this.userRepo.save(user);
    delete (user as any).password;
    return user;
  }

  static async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user || !user.isActive) throw new Error('Invalid credentials');
    const valid = await comparePassword(dto.password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const tokens = generateTokens(user);
    return { ...tokens, id: user.id };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findOneBy({ id: payload.id });
    if (!user || !user.isActive) throw new Error('User not found or blocked');
    return generateTokens(user);
  }
} 