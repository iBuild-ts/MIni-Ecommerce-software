import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    priceCents: z.number().int().positive('Price must be positive'),
    currency: z.string().default('usd'),
    stock: z.number().int().min(0).default(0),
    sku: z.string().optional(),
    mainImageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    priceCents: z.number().int().positive().optional(),
    currency: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().optional(),
    mainImageUrl: z.string().url().optional().nullable(),
    videoUrl: z.string().url().optional().nullable(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
