import { AuthService } from './auth.service';
import { User, UserRole } from '../entity/User';
import * as hashUtils from '../utils/hash';
import * as jwtUtils from '../utils/jwt';

describe('AuthService', () => {
  const user: User = {
    id: '1',
    fullName: 'Test User',
    birthDate: new Date('1990-01-01'),
    email: 'test@example.com',
    password: 'hashed',
    role: UserRole.USER,
    isActive: true,
  };

  beforeAll(() => {
    // Мокаем методы userRepo
    (AuthService as any).userRepo = {
      findOneBy: jest.fn(async (q: any) => (q.email === user.email ? user : null)),
      create: jest.fn((dto: any) => ({ ...dto, id: '2' })),
      save: jest.fn(async (u: any) => u),
    };
    jest.spyOn(hashUtils, 'hashPassword').mockImplementation(async (p) => 'hashed');
    jest.spyOn(hashUtils, 'comparePassword').mockImplementation(async (p, h) => p === 'password123' && h === 'hashed');
    jest.spyOn(jwtUtils, 'generateTokens').mockImplementation((u) => ({ accessToken: 'a', refreshToken: 'r' }));
  });

  it('should register user', async () => {
    const dto = { fullName: 'User', birthDate: '1990-01-01', email: 'new@example.com', password: 'password123' };
    const result = await AuthService.register(dto as any);
    expect(result.fullName).toBe(dto.fullName);
    expect(result.email).toBe(dto.email);
    expect(result.role).toBe(UserRole.USER);
    expect(result).not.toHaveProperty('password');
  });

  it('should not register with existing email', async () => {
    await expect(AuthService.register({ ...user, password: 'password123' } as any)).rejects.toThrow('Email already in use');
  });

  it('should login user', async () => {
    const dto = { email: user.email, password: 'password123' };
    const result = await AuthService.login(dto as any);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('id');
  });

  it('should not login with wrong password', async () => {
    const dto = { email: user.email, password: 'wrong' };
    await expect(AuthService.login(dto as any)).rejects.toThrow('Invalid credentials');
  });
}); 