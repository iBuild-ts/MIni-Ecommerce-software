import { prisma } from '@myglambeauty/db';
import { AppError } from '../../middleware/errorHandler';

export class LeadService {
  async create(data: {
    email: string;
    name?: string;
    phone?: string;
    source?: string;
    tags?: string[];
    notes?: string;
  }) {
    return prisma.lead.create({ data });
  }

  async getAll(options?: {
    source?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (options?.source) {
      where.source = options.source;
    }
    if (options?.tags?.length) {
      where.tags = { hasSome: options.tags };
    }
    if (options?.search) {
      where.OR = [
        { email: { contains: options.search, mode: 'insensitive' } },
        { name: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  }

  async getById(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async update(id: string, data: {
    name?: string;
    phone?: string;
    tags?: string[];
    notes?: string;
  }) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return prisma.lead.update({ where: { id }, data });
  }

  async delete(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    await prisma.lead.delete({ where: { id } });
    return { success: true };
  }

  async getStats() {
    const [total, bySource] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['source'],
        _count: true,
      }),
    ]);

    return { total, bySource };
  }
}

export const leadService = new LeadService();
