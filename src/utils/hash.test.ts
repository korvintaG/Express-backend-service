import { hashPassword, comparePassword } from './hash';

describe('Password hashing', () => {
  it('should hash and compare password correctly', async () => {
    const password = 'mySecret123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should not match wrong password', async () => {
    const password = 'mySecret123';
    const hash = await hashPassword(password);
    const isMatch = await comparePassword('wrongPassword', hash);
    expect(isMatch).toBe(false);
  });
}); 