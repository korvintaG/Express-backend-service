import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'access.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const now = new Date().toISOString();
  const log = `[${now}] ${req.method} ${req.originalUrl} from ${req.ip}\n`;
  fs.appendFile(logFile, log, (err) => {
    if (err) console.error('Logger error:', err);
  });
  next();
} 