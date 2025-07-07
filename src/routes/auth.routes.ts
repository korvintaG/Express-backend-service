import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateDto } from '../middlewares/validate.middleware';
import { RegisterDto } from '../dtos/register.dto';

const router = Router();

router.post('/register', validateDto(RegisterDto), AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

export default router; 