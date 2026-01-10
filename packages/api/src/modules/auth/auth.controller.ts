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
}

export const authController = new AuthController();
