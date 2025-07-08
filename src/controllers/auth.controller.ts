import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
};

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const dto: RegisterDto = req.body;
      const user = await AuthService.register(dto);
      res.status(201).json(user);
    } catch (e: any) {
      console.error('Register error:', e);
      res.status(400).json({ message: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const dto: LoginDto = req.body;
      const { accessToken, refreshToken, id } = await AuthService.login(dto);
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
      res.json({ accessToken, id });
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token' });
        return;
      }
      const tokens = await AuthService.refresh(refreshToken);
      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.json({ accessToken: tokens.accessToken });
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    res.json({ message: 'Logged out' });
  }
} 