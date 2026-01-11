import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.put('/profile', authenticate, authController.updateProfile.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/change-password', authenticate, authController.changePassword.bind(authController));

export default router;
