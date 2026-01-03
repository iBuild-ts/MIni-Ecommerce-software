import { Router } from 'express';
import { productController } from './product.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createProductSchema, updateProductSchema } from './product.validators';

const router = Router();

// Public routes
router.get('/', productController.getAll.bind(productController));
router.get('/categories', productController.getCategories.bind(productController));
router.get('/slug/:slug', productController.getBySlug.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createProductSchema),
  productController.create.bind(productController)
);

router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validate(updateProductSchema),
  productController.update.bind(productController)
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  productController.delete.bind(productController)
);

router.post(
  '/:id/images',
  authenticate,
  requireAdmin,
  productController.addImage.bind(productController)
);

router.delete(
  '/:id/images/:imageId',
  authenticate,
  requireAdmin,
  productController.removeImage.bind(productController)
);

router.post(
  '/:id/stock',
  authenticate,
  requireAdmin,
  productController.updateStock.bind(productController)
);

export default router;
