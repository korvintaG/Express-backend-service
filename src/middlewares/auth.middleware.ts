import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token' });
    return;
  }
  try {
    const token = auth.split(' ')[1];
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}; 