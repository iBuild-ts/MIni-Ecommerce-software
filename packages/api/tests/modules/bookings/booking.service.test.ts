import { BookingService } from '../../src/modules/bookings/booking.service';
import { TestDatabase, TestDataFactory } from '../utils/test-database';
import { BookingStatus } from '@myglambeauty/db';

describe('BookingService', () => {
  let bookingService: BookingService;

  beforeAll(async () => {
    await TestDatabase.connect();
    await TestDatabase.reset();
    bookingService = new BookingService();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  beforeEach(async () => {
    await TestDatabase.reset();
  });

  describe('create', () => {
    it('should create a new booking with existing customer', async () => {
      // Create test customer first
      const customerData = TestDataFactory.createCustomer();
      await TestDatabase.getInstance().customer.create({
        data: customerData,
      });

      const bookingData = TestDataFactory.createBooking({
        email: customerData.email,
      });

      const result = await bookingService.create(bookingData);

      expect(result).toBeDefined();
      expect(result.email).toBe(bookingData.email);
      expect(result.service).toBe(bookingData.service);
      expect(result.status).toBe('PENDING');
      expect(result.customerId).toBeDefined();
    });

    it('should create a new customer if not exists', async () => {
      const bookingData = TestDataFactory.createBooking();

      const result = await bookingService.create(bookingData);

      expect(result).toBeDefined();
      expect(result.email).toBe(bookingData.email);
      expect(result.customer).toBeDefined();
      expect(result.customer.email).toBe(bookingData.email);
    });

    it('should parse customer name correctly', async () => {
      const bookingData = TestDataFactory.createBooking({
        name: 'John Doe Smith',
      });

      const result = await bookingService.create(bookingData);

      expect(result.customer.firstName).toBe('John');
      expect(result.customer.lastName).toBe('Doe Smith');
    });

    it('should handle single name correctly', async () => {
      const bookingData = TestDataFactory.createBooking({
        name: 'John',
      });

      const result = await bookingService.create(bookingData);

      expect(result.customer.firstName).toBe('John');
      expect(result.customer.lastName).toBeNull();
    });

    it('should set correct scheduled date', async () => {
      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      const bookingData = TestDataFactory.createBooking({
        scheduledFor: scheduledDate,
      });

      const result = await bookingService.create(bookingData);

      expect(result.scheduledFor).toBeInstanceOf(Date);
      expect(new Date(result.scheduledFor).getTime()).toBeCloseTo(scheduledDate.getTime(), -1000);
    });
  });

  describe('getAll', () => {
    beforeEach(async () => {
      // Create test data
      await TestDatabase.seedTestData();
    });

    it('should return all bookings', async () => {
      const result = await bookingService.getAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter bookings by status', async () => {
      const pendingBookings = await bookingService.getAll({
        status: BookingStatus.PENDING,
      });

      expect(pendingBookings.every(booking => booking.status === BookingStatus.PENDING)).toBe(true);
    });

    it('should filter bookings by date range', async () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const bookings = await bookingService.getAll({
        startDate: tomorrow,
        endDate: nextWeek,
      });

      expect(bookings.every(booking => {
        const bookingDate = new Date(booking.scheduledFor);
        return bookingDate >= tomorrow && bookingDate <= nextWeek;
      })).toBe(true);
    });

    it('should limit results', async () => {
      const bookings = await bookingService.getAll({
        limit: 5,
      });

      expect(bookings.length).toBeLessThanOrEqual(5);
    });

    it('should offset results', async () => {
      const allBookings = await bookingService.getAll();
      const offsetBookings = await bookingService.getAll({
        offset: 1,
      });

      expect(offsetBookings.length).toBe(allBookings.length - 1);
    });
  });

  describe('getById', () => {
    let createdBooking: any;

    beforeEach(async () => {
      const bookingData = TestDataFactory.createBooking();
      createdBooking = await bookingService.create(bookingData);
    });

    it('should return booking by ID', async () => {
      const result = await bookingService.getById(createdBooking.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdBooking.id);
      expect(result.email).toBe(createdBooking.email);
    });

    it('should return null for non-existent booking', async () => {
      const result = await bookingService.getById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    let createdBooking: any;

    beforeEach(async () => {
      const bookingData = TestDataFactory.createBooking();
      createdBooking = await bookingService.create(bookingData);
    });

    it('should update booking status', async () => {
      const updateData = {
        status: BookingStatus.CONFIRMED,
      };

      const result = await bookingService.update(createdBooking.id, updateData);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(result.id).toBe(createdBooking.id);
    });

    it('should update multiple fields', async () => {
      const newDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // Day after tomorrow
      const updateData = {
        status: BookingStatus.CONFIRMED,
        scheduledFor: newDate,
        notes: 'Updated notes',
      };

      const result = await bookingService.update(createdBooking.id, updateData);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(new Date(result.scheduledFor).getTime()).toBeCloseTo(newDate.getTime(), -1000);
      expect(result.notes).toBe('Updated notes');
    });

    it('should throw error for non-existent booking', async () => {
      await expect(bookingService.update('non-existent-id', { status: BookingStatus.CONFIRMED }))
        .rejects.toThrow();
    });
  });

  describe('delete', () => {
    let createdBooking: any;

    beforeEach(async () => {
      const bookingData = TestDataFactory.createBooking();
      createdBooking = await bookingService.create(bookingData);
    });

    it('should delete booking', async () => {
      await bookingService.delete(createdBooking.id);

      const result = await bookingService.getById(createdBooking.id);
      expect(result).toBeNull();
    });

    it('should throw error for non-existent booking', async () => {
      await expect(bookingService.delete('non-existent-id'))
        .rejects.toThrow();
    });
  });

  describe('getCustomerBookings', () => {
    let customer: any;

    beforeEach(async () => {
      customer = await TestDatabase.getInstance().customer.create({
        data: TestDataFactory.createCustomer(),
      });

      // Create multiple bookings for the customer
      for (let i = 0; i < 3; i++) {
        await bookingService.create({
          ...TestDataFactory.createBooking(),
          customerId: customer.id,
        });
      }
    });

    it('should return all bookings for a customer', async () => {
      const result = await bookingService.getCustomerBookings(customer.id);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result.every(booking => booking.customerId === customer.id)).toBe(true);
    });

    it('should return empty array for customer with no bookings', async () => {
      const newCustomer = await TestDatabase.getInstance().customer.create({
        data: TestDataFactory.createCustomer({ email: 'new@example.com' }),
      });

      const result = await bookingService.getCustomerBookings(newCustomer.id);

      expect(result).toEqual([]);
    });
  });
});
