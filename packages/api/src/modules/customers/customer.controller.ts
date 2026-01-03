import { Request, Response, NextFunction } from 'express';
import { customerService } from './customer.service';

export class CustomerController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, tags, limit, offset } = req.query;
      const result = await customerService.getAll({
        search: search as string,
        tags: tags ? (tags as string).split(',') : undefined,
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
      const customer = await customerService.getById(req.params.id);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customerService.update(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async addTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag } = req.body;
      const customer = await customerService.addTag(req.params.id, tag);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async removeTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag } = req.params;
      const customer = await customerService.removeTag(req.params.id, tag);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await customerService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
