# Testing Strategies

Comprehensive testing guide for mini programs, covering unit testing, integration testing, end-to-end testing, performance testing, and quality assurance practices.

## Testing Fundamentals

### Testing Pyramid
- **Unit Tests**: Fast, isolated tests for individual components
- **Integration Tests**: Tests for component interactions and API integrations
- **End-to-End Tests**: Full user journey testing
- **Manual Testing**: Exploratory and usability testing

### Testing Principles
- **Test Early and Often**: Continuous testing throughout development
- **Test Automation**: Automated testing for regression prevention
- **Test Coverage**: Comprehensive coverage of critical functionality
- **Test Maintainability**: Easy-to-maintain and understand tests

## Unit Testing

### Component Testing
```javascript
// Unit testing for mini program components
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import UserProfile from '../components/UserProfile';

describe('UserProfile Component', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  it('should render user information correctly', () => {
    const { getByText, getByAltText } = render(
      <UserProfile user={mockUser} />
    );

    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('john@example.com')).toBeInTheDocument();
    expect(getByAltText('User avatar')).toHaveAttribute('src', mockUser.avatar);
  });

  it('should handle edit button click', async () => {
    const mockOnEdit = jest.fn();
    const { getByRole } = render(
      <UserProfile user={mockUser} onEdit={mockOnEdit} />
    );

    const editButton = getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockUser.id);
    });
  });

  it('should display loading state', () => {
    const { getByTestId } = render(
      <UserProfile user={null} loading={true} />
    );

    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const errorMessage = 'Failed to load user';
    const { getByText } = render(
      <UserProfile user={null} error={errorMessage} />
    );

    expect(getByText(errorMessage)).toBeInTheDocument();
  });
});
```

### Service Testing
```javascript
// Testing service layer and business logic
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import UserService from '../services/UserService';
import ApiClient from '../utils/ApiClient';

// Mock API client
jest.mock('../utils/ApiClient');
const mockApiClient = ApiClient as jest.Mocked<typeof ApiClient>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      };

      mockApiClient.get.mockResolvedValue({
        data: mockUserData,
        status: 200
      });

      const result = await userService.getUserProfile('123');

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/123');
      expect(result).toEqual(mockUserData);
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'User not found';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(userService.getUserProfile('invalid-id'))
        .rejects.toThrow(errorMessage);
    });

    it('should cache user data', async () => {
      const mockUserData = { id: '123', name: 'John Doe' };
      mockApiClient.get.mockResolvedValue({ data: mockUserData });

      // First call
      await userService.getUserProfile('123');
      // Second call
      await userService.getUserProfile('123');

      // API should only be called once due to caching
      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = '123';
      const updateData = { name: 'Jane Doe' };
      const updatedUser = { id: userId, ...updateData };

      mockApiClient.put.mockResolvedValue({
        data: updatedUser,
        status: 200
      });

      const result = await userService.updateUserProfile(userId, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/users/${userId}`,
        updateData
      );
      expect(result).toEqual(updatedUser);
    });

    it('should validate input data', async () => {
      const invalidData = { email: 'invalid-email' };

      await expect(userService.updateUserProfile('123', invalidData))
        .rejects.toThrow('Invalid email format');
    });
  });
});
```

### Utility Function Testing
```javascript
// Testing utility functions and helpers
import { describe, it, expect } from '@jest/globals';
import {
  formatDate,
  validateEmail,
  calculateAge,
  debounce
} from '../utils/helpers';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-12-25');
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('12/25/2023');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2023-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(33);
    });

    it('should handle edge cases', () => {
      const birthDate = new Date('2000-12-31');
      const referenceDate = new Date('2001-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(0);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Should not have been called yet
      expect(callCount).toBe(0);

      // Wait for debounce delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });
});
```

## Integration Testing

### API Integration Testing
```javascript
// Testing API integrations and data flow
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { setupTestDatabase, cleanupTestDatabase } from '../test-utils/database';

describe('User API Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: userData.name,
        email: userData.email
      });
      expect(response.body.password).toBeUndefined();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: 'John Doe'
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toContain('Email is required');
      expect(response.body.errors).toContain('Password is required');
    });

    it('should prevent duplicate email addresses', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve user by ID', async () => {
      // Create a user first
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      const userId = createResponse.body.id;

      // Retrieve the user
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });
});
```

### Database Integration Testing
```javascript
// Testing database operations and data persistence
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UserRepository } from '../repositories/UserRepository';
import { DatabaseConnection } from '../database/connection';
import { createTestUser, cleanupTestData } from '../test-utils/fixtures';

describe('UserRepository Integration', () => {
  let userRepository: UserRepository;
  let dbConnection: DatabaseConnection;

  beforeEach(async () => {
    dbConnection = new DatabaseConnection(process.env.TEST_DATABASE_URL);
    await dbConnection.connect();
    userRepository = new UserRepository(dbConnection);
  });

  afterEach(async () => {
    await cleanupTestData(dbConnection);
    await dbConnection.disconnect();
  });

  describe('createUser', () => {
    it('should create user in database', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        hashedPassword: 'hashed_password'
      };

      const createdUser = await userRepository.createUser(userData);

      expect(createdUser).toMatchObject({
        id: expect.any(String),
        name: userData.name,
        email: userData.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      // Verify user exists in database
      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toMatchObject(userData);
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        hashedPassword: 'hashed_password'
      };

      await userRepository.createUser(userData);

      await expect(userRepository.createUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const user = await createTestUser(userRepository);
      const updateData = { name: 'Updated Name' };

      const updatedUser = await userRepository.updateUser(user.id, updateData);

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.updatedAt).not.toEqual(user.updatedAt);
    });

    it('should handle partial updates', async () => {
      const user = await createTestUser(userRepository);
      const originalEmail = user.email;

      await userRepository.updateUser(user.id, { name: 'New Name' });
      const updatedUser = await userRepository.findById(user.id);

      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.email).toBe(originalEmail);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = await createTestUser(userRepository);

      const foundUser = await userRepository.findByEmail(user.email);

      expect(foundUser).toMatchObject({
        id: user.id,
        email: user.email
      });
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await userRepository.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });
});
```

## End-to-End Testing

### User Journey Testing
```javascript
// End-to-end testing with Playwright
import { test, expect } from '@playwright/test';

test.describe('User Registration and Login Flow', () => {
  test('should complete full user registration and login', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill registration form
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="password-input"]', 'securePassword123');
    await page.fill('[data-testid="confirm-password-input"]', 'securePassword123');

    // Submit registration
    await page.click('[data-testid="register-button"]');

    // Verify registration success
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Registration successful');

    // Navigate to login page
    await page.goto('/login');

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="password-input"]', 'securePassword123');

    // Submit login
    await page.click('[data-testid="login-button"]');

    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]'))
      .toContainText('John Doe');
  });

  test('should handle registration validation errors', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.click('[data-testid="register-button"]');

    // Verify validation errors
    await expect(page.locator('[data-testid="name-error"]'))
      .toContainText('Name is required');
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Email is required');
    await expect(page.locator('[data-testid="password-error"]'))
      .toContainText('Password is required');
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid email or password');
  });
});

test.describe('E-commerce Shopping Flow', () => {
  test('should complete product purchase', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Browse products
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');

    // Add to cart
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');

    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping information
    await page.fill('[data-testid="address-input"]', '123 Main St');
    await page.fill('[data-testid="city-input"]', 'New York');
    await page.fill('[data-testid="zip-input"]', '10001');

    // Fill payment information
    await page.fill('[data-testid="card-number-input"]', '4111111111111111');
    await page.fill('[data-testid="expiry-input"]', '12/25');
    await page.fill('[data-testid="cvv-input"]', '123');

    // Complete purchase
    await page.click('[data-testid="place-order-button"]');

    // Verify order confirmation
    await expect(page.locator('[data-testid="order-confirmation"]'))
      .toContainText('Order placed successfully');
    await expect(page.locator('[data-testid="order-number"]'))
      .toBeVisible();
  });
});
```

## Performance Testing

### Load Testing
```javascript
// Performance testing with Artillery.js
// artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  payload:
    path: "./test-data/users.csv"
    fields:
      - "email"
      - "password"

scenarios:
  - name: "User login and browse"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/products"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - get:
          url: "/api/products/{{ $randomInt(1, 100) }}"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Product search"
    weight: 20
    flow:
      - get:
          url: "/api/products/search"
          qs:
            q: "{{ $randomString() }}"
            limit: 20

  - name: "Add to cart"
    weight: 10
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.token"
              as: "authToken"
      - post:
          url: "/api/cart/items"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            productId: "{{ $randomInt(1, 100) }}"
            quantity: "{{ $randomInt(1, 5) }}"
```

### Browser Performance Testing
```javascript
// Performance testing with Lighthouse CI
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

const performanceTest = async (url) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse(url, options);
  
  await chrome.kill();
  
  const { lhr } = runnerResult;
  const { score } = lhr.categories.performance;
  
  return {
    performanceScore: score * 100,
    metrics: {
      firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
      speedIndex: lhr.audits['speed-index'].numericValue
    }
  };
};

// Performance test suite
describe('Performance Tests', () => {
  it('should meet performance benchmarks for home page', async () => {
    const results = await performanceTest('http://localhost:3000');
    
    expect(results.performanceScore).toBeGreaterThan(90);
    expect(results.metrics.firstContentfulPaint).toBeLessThan(2000);
    expect(results.metrics.largestContentfulPaint).toBeLessThan(2500);
    expect(results.metrics.cumulativeLayoutShift).toBeLessThan(0.1);
  });
  
  it('should meet performance benchmarks for product page', async () => {
    const results = await performanceTest('http://localhost:3000/products/1');
    
    expect(results.performanceScore).toBeGreaterThan(85);
    expect(results.metrics.totalBlockingTime).toBeLessThan(300);
  });
});
```

## Test Automation

### CI/CD Integration
```yaml
# GitHub Actions workflow for testing
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run database migrations
      run: npm run db:migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: npm start &
    
    - name: Wait for application
      run: npx wait-on http://localhost:3000
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

### Test Data Management
```javascript
// Test data factories and fixtures
class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createProduct(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      inStock: faker.datatype.boolean(),
      ...overrides
    };
  }
  
  static createOrder(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      userId: faker.datatype.uuid(),
      items: [
        {
          productId: faker.datatype.uuid(),
          quantity: faker.datatype.number({ min: 1, max: 5 }),
          price: parseFloat(faker.commerce.price())
        }
      ],
      total: parseFloat(faker.commerce.price()),
      status: 'pending',
      createdAt: new Date(),
      ...overrides
    };
  }
}

// Database seeding for tests
class TestDatabaseSeeder {
  async seedUsers(count = 10) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = TestDataFactory.createUser();
      users.push(await this.userRepository.create(user));
    }
    return users;
  }
  
  async seedProducts(count = 50) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const product = TestDataFactory.createProduct();
      products.push(await this.productRepository.create(product));
    }
    return products;
  }
  
  async cleanup() {
    await this.orderRepository.deleteAll();
    await this.productRepository.deleteAll();
    await this.userRepository.deleteAll();
  }
}
```

## Testing Best Practices

### Test Organization
- **Clear Test Structure**: Organize tests by feature or component
- **Descriptive Test Names**: Use clear, descriptive test names
- **Test Independence**: Ensure tests can run independently
- **Test Data Isolation**: Use separate test data for each test

### Test Quality
- **Single Responsibility**: Each test should verify one behavior
- **Arrange-Act-Assert**: Follow the AAA pattern
- **Test Edge Cases**: Include boundary and error conditions
- **Maintainable Tests**: Write tests that are easy to understand and modify

### Coverage Goals
- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: Cover critical user paths
- **E2E Tests**: Cover main user journeys
- **Performance Tests**: Monitor key performance metrics

This comprehensive testing guide ensures robust quality assurance for mini programs through systematic testing practices and automation.