import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export function generateTokens(user: User) {
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { id: string; role: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as { id: string; role: string };
} 