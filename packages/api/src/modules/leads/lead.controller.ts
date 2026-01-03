import { Request, Response, NextFunction } from 'express';
import { leadService } from './lead.service';

export class LeadController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.create(req.body);
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { source, tags, search, limit, offset } = req.query;
      const result = await leadService.getAll({
        source: source as string,
        tags: tags ? (tags as string).split(',') : undefined,
        search: search as string,
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
      const lead = await leadService.getById(req.params.id);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.update(req.params.id, req.body);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await leadService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await leadService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();
