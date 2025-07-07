import { generateTokens, verifyAccessToken, verifyRefreshToken } from './jwt';
import { User, UserRole } from '../entity/User';

describe('JWT utils', () => {
  const user: User = {
    id: 'test-id',
    fullName: 'Test User',
    birthDate: new Date('1990-01-01'),
    email: 'test@example.com',
    password: 'hashed',
    role: UserRole.USER,
    isActive: true,
  };

  it('should generate and verify access and refresh tokens', () => {
    const { accessToken, refreshToken } = generateTokens(user);
    const accessPayload = verifyAccessToken(accessToken);
    const refreshPayload = verifyRefreshToken(refreshToken);
    expect(accessPayload.id).toBe(user.id);
    expect(accessPayload.role).toBe(user.role);
    expect(refreshPayload.id).toBe(user.id);
    expect(refreshPayload.role).toBe(user.role);
  });

  it('should throw on invalid token', () => {
    expect(() => verifyAccessToken('invalid')).toThrow();
    expect(() => verifyRefreshToken('invalid')).toThrow();
  });
}); 