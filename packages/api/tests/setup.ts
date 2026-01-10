// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/myglambeauty_test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_test';
  process.env.SMTP_HOST = 'localhost';
  process.env.SMTP_USER = 'test';
  process.env.SMTP_PASS = 'test';
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('All tests completed');
});

beforeEach(async () => {
  // Setup before each test
  jest.clearAllMocks();
});

afterEach(async () => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
