import { Router } from 'express';
import { productController } from './product.controller';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes - now using database-backed controller
router.get('/', productController.getAll.bind(productController));
router.get('/slug/:slug', productController.getBySlug.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// Admin routes
router.post(
  '/',
  upload.array('images', 5),
  productController.create.bind(productController)
);

router.patch(
  '/:id',
  upload.array('images', 5),
  productController.update.bind(productController)
);

router.delete(
  '/:id',
  productController.delete.bind(productController)
);

// Image management
router.post('/:id/images', productController.addImage.bind(productController));
router.delete('/images/:imageId', productController.removeImage.bind(productController));

export default router;
