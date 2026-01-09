import { Request, Response } from 'express';

// Simple in-memory storage for demo
let products: any[] = [
  {
    id: '1',
    name: 'Queen Mink Lashes',
    sku: 'QML-001',
    slug: 'queen-mink-lashes',
    description: 'Luxurious mink lashes for a glamorous look',
    priceCents: 2499,
    compareAtPriceCents: null,
    category: 'Lashes',
    status: 'active',
    stock: 150,
    tags: ['bestseller', 'mink'],
    mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Princess Faux Mink Set',
    sku: 'PFM-002',
    slug: 'princess-faux-mink-set',
    description: 'Elegant faux mink lashes for a natural look',
    priceCents: 3499,
    compareAtPriceCents: null,
    category: 'Lashes',
    status: 'active',
    stock: 200,
    tags: ['faux mink', 'elegant'],
    mainImageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Natural Beauty Lashes',
    sku: 'NBL-003',
    slug: 'natural-beauty-lashes',
    description: 'Subtle natural-looking everyday lashes',
    priceCents: 1499,
    compareAtPriceCents: null,
    category: 'Lashes',
    status: 'out_of_stock',
    stock: 0,
    tags: ['natural', 'everyday'],
    mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Drama Queen Volume',
    sku: 'DQV-004',
    slug: 'drama-queen-volume',
    description: 'Bold voluminous lashes for dramatic impact',
    priceCents: 2999,
    compareAtPriceCents: null,
    category: 'Lashes',
    status: 'active',
    stock: 100,
    tags: ['volume', 'dramatic'],
    mainImageUrl: 'https://images.unsplash.com/photo-1588495752527-77d73a9a0b75?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Magnetic Lash Kit',
    sku: 'MLK-005',
    slug: 'magnetic-lash-kit',
    description: 'Complete magnetic lash system with applicator',
    priceCents: 3999,
    compareAtPriceCents: null,
    category: 'Accessories',
    status: 'active',
    stock: 80,
    tags: ['magnetic', 'kit', 'accessories'],
    mainImageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Lash Adhesive',
    sku: 'LA-006',
    slug: 'lash-adhesive',
    description: 'Long-lasting lash glue for all lash types',
    priceCents: 899,
    compareAtPriceCents: null,
    category: 'Accessories',
    status: 'active',
    stock: 500,
    tags: ['adhesive', 'glue', 'accessories'],
    mainImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export class SimpleProductController {
  async getAll(req: Request, res: Response) {
    try {
      const { isActive, category, search, limit, offset } = req.query;
      let filteredProducts = products;

      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }

      if (search) {
        const query = (search as string).toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      if (isActive !== undefined) {
        const active = isActive === 'true';
        filteredProducts = filteredProducts.filter(p => p.status === (active ? 'active' : 'inactive'));
      }

      const start = offset ? parseInt(offset as string, 10) : 0;
      const end = limit ? start + parseInt(limit as string, 10) : filteredProducts.length;
      
      res.json({
        products: filteredProducts.slice(start, end),
        total: filteredProducts.length,
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log('Creating product with data:', req.body);
      console.log('Files received:', req.files);
      
      // Handle FormData
      let productData: any;
      
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        productData = {
          name: req.body.name,
          sku: req.body.sku || '', // Make sku optional
          description: req.body.description,
          priceCents: parseInt(req.body.priceCents),
          compareAtPriceCents: req.body.compareAtPriceCents ? parseInt(req.body.compareAtPriceCents) : null,
          category: req.body.category,
          status: req.body.status || 'active',
          stock: parseInt(req.body.stock),
          tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        };
        
        // Generate slug from name if not provided
        if (!productData.slug) {
          productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        
        // Handle main image - check if files exist
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          const mainImage = req.files[0] as Express.Multer.File;
          productData.mainImageUrl = `data:${mainImage.mimetype};base64,${mainImage.buffer.toString('base64')}`;
          console.log('Image processed successfully');
        } else {
          // Use a default image if none provided
          productData.mainImageUrl = 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=200';
          console.log('Using default image');
        }
      } else {
        productData = req.body;
        // Generate slug if not provided
        if (!productData.slug) {
          productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
      }

      // Validate required fields
      if (!productData.name || !productData.priceCents) {
        console.error('Validation failed: missing name or price');
        return res.status(400).json({ error: 'Name and price are required' });
      }

      // Create new product
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.push(newProduct);
      
      console.log('Product created successfully:', newProduct);
      
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product: ' + (error as Error).message });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const product = products.find(p => p.slug === slug);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Get product by slug error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = products.find(p => p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let updateData: any;
      
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        updateData = {
          name: req.body.name,
          sku: req.body.sku || '',
          description: req.body.description,
          priceCents: parseInt(req.body.priceCents),
          compareAtPriceCents: req.body.compareAtPriceCents ? parseInt(req.body.compareAtPriceCents) : null,
          category: req.body.category,
          status: req.body.status || 'active',
          stock: parseInt(req.body.stock),
          tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        };
        
        // Handle main image - check if files exist
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          const mainImage = req.files[0] as Express.Multer.File;
          updateData.mainImageUrl = `data:${mainImage.mimetype};base64,${mainImage.buffer.toString('base64')}`;
        }
      } else {
        updateData = req.body;
      }

      // Update the product
      const updatedProduct = {
        ...products[productIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      products[productIndex] = updatedProduct;
      
      console.log('Product updated successfully:', updatedProduct);
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product: ' + (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }

      products.splice(productIndex, 1);
      
      console.log('Product deleted successfully');
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const simpleProductController = new SimpleProductController();
