import { Request, Response, NextFunction } from 'express';
import { bookingService } from './booking.service';

export class BookingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, startDate, endDate, limit, offset } = req.query;
      const result = await bookingService.getAll({
        status: status as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
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
      const booking = await bookingService.getById(req.params.id);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateStatus(req.params.id, status);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.update(req.params.id, req.body);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const bookings = await bookingService.getCalendar(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      const slots = await bookingService.getAvailableSlots(new Date(date as string));
      res.json(slots);
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
