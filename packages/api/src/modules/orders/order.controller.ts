import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';

export class OrderController {
  async createCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderService.createCheckout(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, customerId, limit, offset } = req.query;
      const result = await orderService.getAll({
        status: status as any,
        customerId: customerId as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(req.params.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await orderService.updateStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = (req as any).userEmail;
      const result = await orderService.getByCustomerEmail(userEmail);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
