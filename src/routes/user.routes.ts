import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '../entity/User';

const router = Router();

router.get('/:id', authMiddleware, UserController.getById);
router.get('/', authMiddleware, requireRole(UserRole.ADMIN), UserController.getAll);
router.patch('/:id/block', authMiddleware, UserController.block);
router.patch('/:id/promote', authMiddleware, requireRole(UserRole.ADMIN), UserController.promote);

export default router; 