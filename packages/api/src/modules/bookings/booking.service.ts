import { prisma, BookingStatus } from '@myglambeauty/db';
import { AppError } from '../../middleware/errorHandler';
import { emailService } from '../notifications/email.service';

export class BookingService {
  async create(data: {
    email: string;
    name?: string;
    phone?: string;
    scheduledFor: Date;
    duration?: number;
    service?: string;
    source: string;
    notes?: string;
  }) {
    // Check for existing customer
    let customer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: data.email,
          firstName: data.name?.split(' ')[0],
          lastName: data.name?.split(' ').slice(1).join(' '),
          phone: data.phone,
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        ...data,
        customerId: customer.id,
        scheduledFor: new Date(data.scheduledFor),
      },
      include: { customer: true },
    });

    // Send booking confirmation email
    try {
      await emailService.sendBookingConfirmation({
        customerName: data.name || customer.firstName || 'Valued Customer',
        customerEmail: data.email,
        serviceName: data.service || 'Beauty Service',
        date: new Date(data.scheduledFor).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: new Date(data.scheduledFor).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        price: '$150.00', // This would come from service data
        deposit: '$50.00', // This would come from service data
      });
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return booking;
  }

  async getAll(options?: {
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (options?.status) {
      where.status = options.status;
    }
    if (options?.startDate || options?.endDate) {
      where.scheduledFor = {};
      if (options?.startDate) {
        where.scheduledFor.gte = options.startDate;
      }
      if (options?.endDate) {
        where.scheduledFor.lte = options.endDate;
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: { customer: true },
        orderBy: { scheduledFor: 'asc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total };
  }

  async getById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return booking;
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return prisma.booking.update({
      where: { id },
      data: { status },
      include: { customer: true },
    });
  }

  async update(id: string, data: {
    scheduledFor?: Date;
    duration?: number;
    service?: string;
    notes?: string;
  }) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return prisma.booking.update({
      where: { id },
      data: {
        ...data,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
      },
      include: { customer: true },
    });
  }

  async getCalendar(startDate: Date, endDate: Date) {
    return prisma.booking.findMany({
      where: {
        scheduledFor: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'CANCELLED' },
      },
      include: { customer: true },
      orderBy: { scheduledFor: 'asc' },
    });
  }

  async getAvailableSlots(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0);

    const existingBookings = await prisma.booking.findMany({
      where: {
        scheduledFor: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: 'CANCELLED' },
      },
      select: { scheduledFor: true, duration: true },
    });

    const slots: Date[] = [];
    const slotDuration = 60; // 60 minutes per slot

    for (let hour = 9; hour < 18; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);

      const isBooked = existingBookings.some((booking) => {
        const bookingEnd = new Date(booking.scheduledFor);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.duration);
        return slotTime >= booking.scheduledFor && slotTime < bookingEnd;
      });

      if (!isBooked) {
        slots.push(slotTime);
      }
    }

    return slots;
  }
}

export const bookingService = new BookingService();
