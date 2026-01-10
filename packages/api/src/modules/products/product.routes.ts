import { Router } from 'express';
import { SimpleProductController } from './product.controller.simple';
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

// Simple controller for demo (no database required)
const simpleProductController = new SimpleProductController();

// Public routes
router.get('/', simpleProductController.getAll.bind(simpleProductController));
router.get('/categories', simpleProductController.getCategories.bind(simpleProductController));
router.get('/slug/:slug', simpleProductController.getBySlug.bind(simpleProductController));
router.get('/:id', simpleProductController.getById.bind(simpleProductController));

// Admin routes - no auth required for demo
router.post(
  '/',
  upload.array('images', 5), // Handle up to 5 images
  simpleProductController.create.bind(simpleProductController)
);

router.patch(
  '/:id',
  upload.array('images', 5),
  simpleProductController.update.bind(simpleProductController)
);

router.delete(
  '/:id',
  simpleProductController.delete.bind(simpleProductController)
);

export default router;
