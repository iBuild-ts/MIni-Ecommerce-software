import { prisma } from '@myglambeauty/db';
import { AppError } from '../../middleware/errorHandler';
import { CreateProductInput, UpdateProductInput } from './product.validators';

export class ProductService {
  async getAll(options?: {
    isActive?: boolean;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }
    if (options?.category) {
      where.category = options.category;
    }
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { tags: { has: options.search.toLowerCase() } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { galleryImages: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { galleryImages: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { galleryImages: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError('Product with this slug already exists', 400);
    }

    return prisma.product.create({
      data,
      include: { galleryImages: true },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        throw new AppError('Product with this slug already exists', 400);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: { galleryImages: true },
    });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await prisma.product.delete({ where: { id } });
    return { success: true };
  }

  async addImage(productId: string, url: string, alt?: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const maxSortOrder = await prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });

    return prisma.productImage.create({
      data: {
        productId,
        url,
        alt,
        sortOrder: (maxSortOrder._max.sortOrder || 0) + 1,
      },
    });
  }

  async removeImage(imageId: string) {
    await prisma.productImage.delete({ where: { id: imageId } });
    return { success: true };
  }

  async updateStock(productId: string, change: number, reason: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const newStock = product.stock + change;
    if (newStock < 0) {
      throw new AppError('Insufficient stock', 400);
    }

    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          change,
          reason,
        },
      }),
    ]);

    return updatedProduct;
  }

  async getCategories() {
    const products = await prisma.product.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });

    return products.map((p) => p.category).filter(Boolean);
  }

  async duplicate(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { galleryImages: true },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Generate unique slug and SKU
    const timestamp = Date.now();
    const newSlug = `${product.slug}-copy-${timestamp}`;
    const newSku = `${product.sku}-COPY-${timestamp}`;

    // Create duplicate product
    const duplicatedProduct = await prisma.product.create({
      data: {
        name: `${product.name} (Copy)`,
        slug: newSlug,
        sku: newSku,
        description: product.description,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        stock: product.stock,
        category: product.category,
        tags: product.tags,
        mainImageUrl: product.mainImageUrl,
        isActive: false, // Start as inactive so user can edit before publishing
      },
      include: { galleryImages: true },
    });

    // Duplicate gallery images if any
    if (product.galleryImages.length > 0) {
      await prisma.productImage.createMany({
        data: product.galleryImages.map((img, index) => ({
          productId: duplicatedProduct.id,
          url: img.url,
          alt: img.alt,
          sortOrder: index,
        })),
      });
    }

    return duplicatedProduct;
  }
}

export const productService = new ProductService();
