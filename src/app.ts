import express from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { loggerMiddleware } from './middlewares/logger.middleware';

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app; 