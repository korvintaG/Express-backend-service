import express from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { loggerMiddleware } from './middlewares/logger.middleware';
import cookieParser from 'cookie-parser';

const app = express();

// Мониторинг памяти для отслеживания утечек
const memoryMonitor = () => {
  const used = process.memoryUsage();
  const memoryInfo = {
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`,
    arrayBuffers: `${Math.round(used.arrayBuffers / 1024 / 1024)} MB`
  };
  
  console.log('Memory Usage:', memoryInfo);
  
  // Предупреждение при высоком использовании памяти
  const heapUsedMB = used.heapUsed / 1024 / 1024;
  if (heapUsedMB > 500) { // 500MB
    console.warn(`⚠️  High memory usage: ${Math.round(heapUsedMB)} MB`);
  }
  
  // Критическое предупреждение при очень высоком использовании
  if (heapUsedMB > 1000) { // 1GB
    console.error(`🚨 Critical memory usage: ${Math.round(heapUsedMB)} MB`);
  }
};

// Запускаем мониторинг памяти каждые 30 секунд
setInterval(memoryMonitor, 30000);

// Rate Limiting для защиты от DDoS атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP за 15 минут
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Возвращает заголовки RateLimit-*
  legacyHeaders: false, // Отключает заголовки X-RateLimit-*
});

// Применяем rate limiting ко всем запросам
app.use(limiter);

// Ограничения размера запросов для защиты от вылетов по памяти
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app; 