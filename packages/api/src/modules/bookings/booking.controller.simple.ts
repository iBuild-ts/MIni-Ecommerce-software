import { Request, Response } from 'express';

// In-memory booking storage for demo (replaces database dependency)
let bookings: any[] = [
  {
    id: '1767999000001',
    service: {
      id: 'sew-in-special',
      name: 'FALL IN LOVE WITH HAIR *SEW IN* SPECIAL',
      duration: '4 hours',
      price: '$249.99'
    },
    date: '2024-01-15',
    time: '10:00 AM',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      notes: 'First time client'
    },
    status: 'confirmed',
    depositPaid: true,
    createdAt: '2024-01-09T22:00:00.000Z',
    updatedAt: '2024-01-09T22:00:00.000Z'
  },
  {
    id: '1767999000002',
    service: {
      id: 'makeup-special',
      name: 'FALL IN LOVE WITH HAIR *MAKEUP *SPECIAL',
      duration: '1 hour',
      price: '$75.00'
    },
    date: '2024-01-16',
    time: '2:00 PM',
    customer: {
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '(555) 987-6543',
      notes: 'Wedding makeup trial'
    },
    status: 'pending',
    depositPaid: false,
    createdAt: '2024-01-09T22:30:00.000Z',
    updatedAt: '2024-01-09T22:30:00.000Z'
  }
];

export class SimpleBookingController {
  async getAll(req: Request, res: Response) {
    try {
      const { status, date, search, limit, offset } = req.query;
      let filteredBookings = bookings;

      if (status) {
        filteredBookings = filteredBookings.filter(b => b.status === status);
      }

      if (date) {
        filteredBookings = filteredBookings.filter(b => b.date === date);
      }

      if (search) {
        const query = (search as string).toLowerCase();
        filteredBookings = filteredBookings.filter(b => 
          b.customer.name.toLowerCase().includes(query) ||
          b.customer.email.toLowerCase().includes(query) ||
          b.service.name.toLowerCase().includes(query)
        );
      }

      const start = offset ? parseInt(offset as string, 10) : 0;
      const end = limit ? start + parseInt(limit as string, 10) : filteredBookings.length;
      
      res.json({
        data: filteredBookings.slice(start, end),
        total: filteredBookings.length,
        start,
        end
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = bookings.find(b => b.id === id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log('Creating booking with data:', req.body);
      
      const bookingData = {
        service: req.body.service,
        date: req.body.date,
        time: req.body.time,
        customer: req.body.customer,
        status: 'pending',
        depositPaid: false
      };

      // Validate required fields
      if (!bookingData.service || !bookingData.date || !bookingData.time || !bookingData.customer?.name || !bookingData.customer?.email) {
        console.error('Validation failed: missing required fields');
        return res.status(400).json({ error: 'Service, date, time, and customer information are required' });
      }

      // Create new booking
      const newBooking = {
        id: Date.now().toString(),
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      bookings.push(newBooking);
      
      console.log('Booking created successfully:', newBooking);
      
      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Failed to create booking: ' + (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingIndex = bookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const updateData = req.body;
      
      // Update the booking
      const updatedBooking = {
        ...bookings[bookingIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      bookings[bookingIndex] = updatedBooking;
      
      console.log('Booking updated successfully:', updatedBooking);
      
      res.json(updatedBooking);
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Failed to update booking: ' + (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingIndex = bookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const deletedBooking = bookings.splice(bookingIndex, 1)[0];
      
      console.log('Booking deleted successfully:', deletedBooking);
      
      res.json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
      console.error('Delete booking error:', error);
      res.status(500).json({ error: 'Failed to delete booking: ' + (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const bookingIndex = bookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      bookings[bookingIndex].status = status;
      bookings[bookingIndex].updatedAt = new Date().toISOString();
      
      console.log('Booking status updated:', bookings[bookingIndex]);
      
      res.json(bookings[bookingIndex]);
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({ error: 'Failed to update booking status: ' + (error as Error).message });
    }
  }

  async getCalendar(req: Request, res: Response) {
    try {
      const { start, end } = req.query;
      
      let filteredBookings = bookings;
      
      if (start && end) {
        filteredBookings = bookings.filter(b => 
          b.date >= start as string && b.date <= end as string
        );
      }

      // Format for calendar display
      const calendarEvents = filteredBookings.map(booking => ({
        id: booking.id,
        title: `${booking.customer.name} - ${booking.service.name}`,
        start: `${booking.date}T${booking.time}`,
        backgroundColor: booking.status === 'confirmed' ? '#10b981' : 
                        booking.status === 'pending' ? '#f59e0b' : 
                        booking.status === 'cancelled' ? '#ef4444' : '#6b7280',
        extendedProps: {
          booking: booking
        }
      }));

      res.json(calendarEvents);
    } catch (error) {
      console.error('Get calendar error:', error);
      res.status(500).json({ error: 'Failed to fetch calendar data' });
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { date } = req.query;
      
      // Define all possible time slots
      const allSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
      ];

      // Get booked slots for the date
      const bookedSlots = bookings
        .filter(booking => booking.date === date && booking.status !== 'cancelled')
        .map(booking => booking.time);

      // Filter available slots
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json(availableSlots);
    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({ error: 'Failed to fetch available slots' });
    }
  }
}
