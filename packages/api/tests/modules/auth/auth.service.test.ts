import { AuthService } from '../../src/modules/auth/auth.service';
import { TestDatabase, TestDataFactory } from '../utils/test-database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../src/middleware/errorHandler';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    await TestDatabase.connect();
    await TestDatabase.reset();
    authService = new AuthService();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  beforeEach(async () => {
    await TestDatabase.reset();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Create test user
      const userData = TestDataFactory.createUser();
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await TestDatabase.getInstance().user.create({
        data: {
          ...userData,
          passwordHash: hashedPassword,
        },
      });

      const result = await authService.login(userData.email, userData.password);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.role).toBe('ADMIN');
    });

    it('should throw error for invalid email', async () => {
      await expect(authService.login('invalid@example.com', 'password'))
        .rejects.toThrow(AppError);
    });

    it('should throw error for invalid password', async () => {
      // Create test user
      const userData = TestDataFactory.createUser();
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await TestDatabase.getInstance().user.create({
        data: {
          ...userData,
          passwordHash: hashedPassword,
        },
      });

      await expect(authService.login(userData.email, 'wrongpassword'))
        .rejects.toThrow(AppError);
    });

    it('should return valid JWT token', async () => {
      // Create test user
      const userData = TestDataFactory.createUser();
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await TestDatabase.getInstance().user.create({
        data: {
          ...userData,
          passwordHash: hashedPassword,
        },
      });

      const result = await authService.login(userData.email, userData.password);
      
      // Verify JWT token
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.userId).toBeDefined();
      expect(decoded.role).toBe('ADMIN');
    });
  });

  describe('register', () => {
    it('should successfully register new user', async () => {
      const userData = TestDataFactory.createUser();

      const result = await authService.register(userData.email, userData.password, userData.name);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.role).toBe('ADMIN');
    });

    it('should throw error for duplicate email', async () => {
      const userData = TestDataFactory.createUser();
      
      // Create first user
      await authService.register(userData.email, userData.password, userData.name);

      // Try to create duplicate
      await expect(authService.register(userData.email, 'password2', 'User 2'))
        .rejects.toThrow(AppError);
    });

    it('should hash password during registration', async () => {
      const userData = TestDataFactory.createUser();
      const password = userData.password;

      await authService.register(userData.email, password, userData.name);

      const user = await TestDatabase.getInstance().user.findUnique({
        where: { email: userData.email },
      });

      expect(user).toBeDefined();
      expect(user!.passwordHash).not.toBe(password);
      expect(user!.passwordHash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should return valid JWT token after registration', async () => {
      const userData = TestDataFactory.createUser();

      const result = await authService.register(userData.email, userData.password, userData.name);
      
      // Verify JWT token
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.userId).toBeDefined();
      expect(decoded.role).toBe('ADMIN');
    });
  });

  describe('password hashing', () => {
    it('should use bcrypt with correct rounds', async () => {
      const userData = TestDataFactory.createUser();
      const password = userData.password;

      await authService.register(userData.email, password, userData.name);

      const user = await TestDatabase.getInstance().user.findUnique({
        where: { email: userData.email },
      });

      // Verify it's a valid bcrypt hash
      const isValid = await bcrypt.compare(password, user!.passwordHash);
      expect(isValid).toBe(true);
    });
  });

  describe('token generation', () => {
    it('should generate token with correct expiration', async () => {
      const userData = TestDataFactory.createUser();

      const result = await authService.register(userData.email, userData.password, userData.name);
      
      // Verify token expiration (should be 7 days from now)
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      const now = Math.floor(Date.now() / 1000);
      const expectedExp = now + (7 * 24 * 60 * 60); // 7 days in seconds
      
      expect(decoded.exp).toBeGreaterThan(expectedExp - 100); // Allow 100s variance
      expect(decoded.exp).toBeLessThan(expectedExp + 100);
    });
  });
});
