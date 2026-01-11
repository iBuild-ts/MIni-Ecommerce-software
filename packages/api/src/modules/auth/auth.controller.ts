import { Request, Response, NextFunction } from 'express';
import { simpleAuthService } from './auth.service.simple';
import { AuthRequest } from '../../middleware/auth';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await simpleAuthService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await simpleAuthService.register(email, password, name);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await simpleAuthService.getProfile(req.userId!);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, phone } = req.body;
      const user = await simpleAuthService.updateProfile(req.userId!, { name, phone });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await simpleAuthService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await simpleAuthService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await simpleAuthService.changePassword(req.userId!, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
