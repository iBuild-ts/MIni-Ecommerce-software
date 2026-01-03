import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';

export class AnalyticsController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getSalesChart(req: Request, res: Response, next: NextFunction) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const chart = await analyticsService.getSalesChart(days);
      res.json(chart);
    } catch (error) {
      next(error);
    }
  }

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await analyticsService.getTopProducts(limit);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async getRecentOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const orders = await analyticsService.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getConversionRate(req: Request, res: Response, next: NextFunction) {
    try {
      const rate = await analyticsService.getConversionRate();
      res.json(rate);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
