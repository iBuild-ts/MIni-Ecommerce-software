import request from 'supertest';
import { Express } from 'express';
import { TestDatabase, TestDataFactory } from '../utils/test-database';
import { ApiTestUtils, MockDataGenerator } from '../utils/api-test-utils';

describe('API Integration Tests', () => {
  let app: Express;
  let apiUtils: ApiTestUtils;

  beforeAll(async () => {
    // Import app after test environment is set up
    const { default: expressApp } = await import('../../src/index');
    app = expressApp;
    apiUtils = new ApiTestUtils(app);
    
    await TestDatabase.connect();
    await TestDatabase.reset();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  beforeEach(async () => {
    await TestDatabase.reset();
  });

  describe('Health Checks', () => {
    it('should return simple health check', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return detailed health check', async () => {
      const response = await request(app).get('/health/detailed');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('cache');
    });

    it('should return readiness status', async () => {
      const response = await request(app).get('/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ready');
    });

    it('should return liveness status', async () => {
      const response = await request(app).get('/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('alive');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const userData = MockDataGenerator.generateUser();

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user.name).toBe(userData.name);
      });

      it('should return 400 for duplicate email', async () => {
        const userData = MockDataGenerator.generateUser();

        // Register first user
        await request(app)
          .post('/api/auth/register')
          .send(userData);

        // Try to register duplicate
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should return 400 for invalid email', async () => {
        const userData = {
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
      });
    });

    describe('POST /api/auth/login', () => {
      beforeEach(async () => {
        // Create test user
        const userData = MockDataGenerator.generateUser();
        await request(app)
          .post('/api/auth/register')
          .send(userData);
      });

      it('should login with valid credentials', async () => {
        const userData = MockDataGenerator.generateUser();

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
      });

      it('should return 401 for invalid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('Booking Endpoints', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login admin user
      const userData = MockDataGenerator.generateUser();
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.token;
    });

    describe('POST /api/bookings', () => {
      it('should create a new booking', async () => {
        const bookingData = MockDataGenerator.generateBooking();

        const response = await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookingData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(bookingData.email);
        expect(response.body.service).toBe(bookingData.service);
      });

      it('should return 401 without authentication', async () => {
        const bookingData = MockDataGenerator.generateBooking();

        const response = await request(app)
          .post('/api/bookings')
          .send(bookingData);

        expect(response.status).toBe(401);
      });

      it('should return 400 for invalid data', async () => {
        const invalidData = {
          email: 'invalid-email',
        };

        const response = await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidData);

        expect(response.status).toBe(400);
      });
    });

    describe('GET /api/bookings', () => {
      beforeEach(async () => {
        // Create test booking
        const bookingData = MockDataGenerator.generateBooking();
        await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookingData);
      });

      it('should get all bookings', async () => {
        const response = await request(app)
          .get('/api/bookings')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('should return 401 without authentication', async () => {
        const response = await request(app)
          .get('/api/bookings');

        expect(response.status).toBe(401);
      });
    });

    describe('PUT /api/bookings/:id', () => {
      let createdBooking: any;

      beforeEach(async () => {
        // Create test booking
        const bookingData = MockDataGenerator.generateBooking();
        const response = await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookingData);

        createdBooking = response.body;
      });

      it('should update booking status', async () => {
        const updateData = {
          status: 'CONFIRMED',
        };

        const response = await request(app)
          .put(`/api/bookings/${createdBooking.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('CONFIRMED');
      });

      it('should return 404 for non-existent booking', async () => {
        const response = await request(app)
          .put('/api/bookings/non-existent-id')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ status: 'CONFIRMED' });

        expect(response.status).toBe(404);
      });
    });
  });

  describe('Product Endpoints', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login admin user
      const userData = MockDataGenerator.generateUser();
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.token;
    });

    describe('GET /api/products', () => {
      it('should get all products', async () => {
        const response = await request(app)
          .get('/api/products');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/products', () => {
      it('should create a new product', async () => {
        const productData = MockDataGenerator.generateProduct();

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send(productData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(productData.name);
        expect(response.body.slug).toBe(productData.slug);
      });

      it('should return 401 without authentication', async () => {
        const productData = MockDataGenerator.generateProduct();

        const response = await request(app)
          .post('/api/products')
          .send(productData);

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should limit auth endpoints', async () => {
      const responses = await apiUtils.testRateLimit('/api/auth/login', 5);

      // First 5 requests should succeed
      for (let i = 0; i < 5; i++) {
        expect(responses[i].status).toBe(401); // Will fail due to invalid credentials, but not rate limited
      }

      // 6th request should be rate limited
      expect(responses[5].status).toBe(429);
      expect(responses[5].body).toHaveProperty('error');
    });

    it('should include rate limit headers', async () => {
      const response = await request(app).get('/api/products');

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();

      await request(app).get('/health');
      await request(app).get('/api/products');

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app).get('/api/products')
      );

      const responses = await Promise.all(promises);

      expect(responses.every(response => response.status === 200)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return proper error format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
