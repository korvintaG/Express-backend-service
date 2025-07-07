import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserRole } from '../entity/User';

export class UserController {
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id, (req as any).user);
      res.json(user);
    } catch (e: any) {
      res.status(403).json({ message: e.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (e: any) {
      res.status(403).json({ message: e.message });
    }
  }

  static async block(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.block(id, (req as any).user);
      res.json(user);
    } catch (e: any) {
      res.status(403).json({ message: e.message });
    }
  }

  static async promote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.promote(id, (req as any).user);
      res.json(user);
    } catch (e: any) {
      res.status(403).json({ message: e.message });
    }
  }
} 