import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const dto: RegisterDto = req.body;
      const user = await AuthService.register(dto);
      res.status(201).json(user);
    } catch (e: any) {
      //console.error('Register error:', e);
      res.status(400).json({ message: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const dto: LoginDto = req.body;
      const tokens = await AuthService.login(dto);
      res.json(tokens);
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refresh(refreshToken);
      res.json(tokens);
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }
} 