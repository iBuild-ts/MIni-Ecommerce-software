import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, category, search, limit, offset } = req.query;
      const result = await productService.getAll({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        category: category as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse FormData fields - convert strings to proper types
      const data: any = {};
      
      if (req.body.name) data.name = req.body.name;
      if (req.body.slug) data.slug = req.body.slug;
      if (req.body.sku) data.sku = req.body.sku;
      if (req.body.description) data.description = req.body.description;
      if (req.body.category) data.category = req.body.category;
      if (req.body.status) data.isActive = req.body.status === 'active';
      
      // Parse numeric fields
      if (req.body.priceCents) {
        data.priceCents = parseInt(req.body.priceCents, 10);
      }
      if (req.body.compareAtPriceCents && req.body.compareAtPriceCents !== '') {
        data.compareAtPriceCents = parseInt(req.body.compareAtPriceCents, 10);
      }
      if (req.body.stock) {
        data.stock = parseInt(req.body.stock, 10);
      }
      
      // Parse tags (comes as JSON string from FormData)
      if (req.body.tags) {
        try {
          data.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
        } catch {
          data.tags = req.body.tags;
        }
      }
      
      // Handle mainImageUrl if provided
      if (req.body.mainImageUrl) {
        data.mainImageUrl = req.body.mainImageUrl;
      }

      const product = await productService.update(req.params.id, data);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { url, alt } = req.body;
      const image = await productService.addImage(req.params.id, url, alt);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  }

  async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.removeImage(req.params.imageId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { change, reason } = req.body;
      const product = await productService.updateStock(req.params.id, change, reason);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
