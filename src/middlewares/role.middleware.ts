import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../entity/User';

export function requireRole(role: UserRole): RequestHandler {
  return (req, res, next) => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      res.status(403).json({ message: 'Forbidden by Role' });
      return;
    }
    next();
  };
} 