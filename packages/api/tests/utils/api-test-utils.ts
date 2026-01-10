import request from 'supertest';
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

export class ApiTestUtils {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  // Helper to create authenticated requests
  private createAuthToken(userId: string, role: string = 'ADMIN'): string {
    return jwt.sign(
      { userId, role },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  // GET request helper
  async get(endpoint: string, token?: string) {
    const req = request(this.app).get(endpoint);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    return req;
  }

  // POST request helper
  async post(endpoint: string, data: any, token?: string) {
    const req = request(this.app).post(endpoint).send(data);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    return req;
  }

  // PUT request helper
  async put(endpoint: string, data: any, token?: string) {
    const req = request(this.app).put(endpoint).send(data);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    return req;
  }

  // DELETE request helper
  async delete(endpoint: string, token?: string) {
    const req = request(this.app).delete(endpoint);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    return req;
  }

  // Create authenticated user token
  createAdminToken(userId: string = 'test-user-id'): string {
    return this.createAuthToken(userId, 'ADMIN');
  }

  createCustomerToken(userId: string = 'test-customer-id'): string {
    return this.createAuthToken(userId, 'CUSTOMER');
  }

  // Helper to test rate limiting
  async testRateLimit(endpoint: string, maxRequests: number = 5) {
    const responses = [];
    
    for (let i = 0; i < maxRequests + 2; i++) {
      const response = await this.get(endpoint);
      responses.push(response);
    }
    
    return responses;
  }

  // Helper to test file uploads
  async uploadFile(endpoint: string, fieldName: string, filePath: string, token?: string) {
    const req = request(this.app).post(endpoint);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    
    return req.attach(fieldName, filePath);
  }

  // Helper to test error responses
  async expectError(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    expectedStatus: number,
    data?: any,
    token?: string
  ) {
    let response;
    
    switch (method) {
      case 'GET':
        response = await this.get(endpoint, token);
        break;
      case 'POST':
        response = await this.post(endpoint, data, token);
        break;
      case 'PUT':
        response = await this.put(endpoint, data, token);
        break;
      case 'DELETE':
        response = await this.delete(endpoint, token);
        break;
    }
    
    expect(response.status).toBe(expectedStatus);
    return response;
  }

  // Helper to test performance
  async measureResponseTime(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, token?: string): Promise<number> {
    const startTime = Date.now();
    
    switch (method) {
      case 'GET':
        await this.get(endpoint, token);
        break;
      case 'POST':
        await this.post(endpoint, data, token);
        break;
      case 'PUT':
        await this.put(endpoint, data, token);
        break;
      case 'DELETE':
        await this.delete(endpoint, token);
        break;
    }
    
    return Date.now() - startTime;
  }
}

// Mock data generator
export class MockDataGenerator {
  static generateUser() {
    return {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'password123',
    };
  }

  static generateProduct() {
    return {
      name: `Test Product ${Date.now()}`,
      slug: `test-product-${Date.now()}`,
      description: 'A test product description',
      price: Math.floor(Math.random() * 10000) + 1000,
      category: 'HAIR',
      images: ['test-image.jpg'],
      inStock: true,
      featured: false,
    };
  }

  static generateBooking() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      email: `test-${Date.now()}@example.com`,
      name: 'Test Customer',
      phone: '+1234567890',
      scheduledFor: tomorrow.toISOString(),
      service: 'Test Service',
      source: 'WEBSITE',
      notes: 'Test notes',
    };
  }

  static generateOrder() {
    return {
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          price: 2999,
        },
      ],
      customerEmail: `test-${Date.now()}@example.com`,
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA',
      },
    };
  }
}
