# Contributing to MYGlamBeauty

Thank you for your interest in contributing to MYGlamBeauty! This guide will help you get started with contributing to our beauty salon management system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Pull Request Process](#pull-request-process)
5. [Code Review Guidelines](#code-review-guidelines)
6. [Issue Reporting](#issue-reporting)
7. [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before you start contributing, make sure you have:

- **Node.js** 18+ installed
- **pnpm** 8+ installed
- **Docker** and **Docker Compose** installed
- **Git** configured with your name and email
- A **GitHub** account

### Initial Setup

1. **Fork the repository:**
   - Go to https://github.com/your-org/myglambeauty-supply
   - Click the "Fork" button in the top right
   - Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/myglambeauty-supply.git
   cd myglambeauty-supply
   ```

2. **Add the original repository as upstream:**
   ```bash
   git remote add upstream https://github.com/your-org/myglambeauty-supply.git
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

4. **Set up your development environment:**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Start development services
   pnpm docker:up
   
   # Set up database
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Verify setup:**
   ```bash
   # Run tests to ensure everything works
   pnpm test
   
   # Check that applications start
   pnpm dev
   ```

## Development Workflow

### Branch Strategy

We use a simplified Git flow with the following branches:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features
- **`bugfix/*`** - Bug fixes
- **`hotfix/*`** - Critical production fixes

### Creating a Feature Branch

1. **Keep your main branch up to date:**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Use descriptive branch names:**
   - ✅ `feature/booking-system`
   - ✅ `bugfix/payment-validation`
   - ✅ `hotfix/security-patch`
   - ❌ `feature-123`
   - ❌ `fix-stuff`

### Making Changes

1. **Follow the coding standards** (see below)
2. **Write tests** for your changes
3. **Update documentation** if needed
4. **Commit your changes** with clear messages

#### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(booking): add online appointment scheduling"
git commit -m "fix(payment): resolve stripe webhook validation error"
git commit -m "docs(api): update authentication endpoints"
```

### Keeping Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

If you have conflicts, resolve them and continue:

```bash
git rebase --continue
```

## Coding Standards

### General Guidelines

- **TypeScript First**: All new code must be written in TypeScript
- **ESLint/Prettier**: Follow the configured linting rules
- **Test Coverage**: Maintain at least 80% test coverage
- **Documentation**: Document complex logic and public APIs

### Frontend (React/Next.js)

**Component Structure:**
```typescript
// Good: Well-structured component
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${variant === 'primary' 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

**File Organization:**
```
components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── index.ts
├── features/              # Feature-specific components
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── BookingList.tsx
│   │   └── index.ts
│   └── payments/
└── layout/                # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── Sidebar.tsx
```

### Backend (Node.js/Express)

**Controller Structure:**
```typescript
// Good: Clean controller with error handling
export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const bookingData = CreateBookingSchema.parse(req.body);
      
      // Call service layer
      const booking = await bookingService.create(bookingData);
      
      // Return response
      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      // Pass to error handler
      next(error);
    }
  }
}
```

**Service Layer:**
```typescript
// Good: Business logic in service layer
export class BookingService {
  async create(data: CreateBookingData): Promise<Booking> {
    // Validate business rules
    if (await this.isTimeSlotTaken(data.scheduledFor)) {
      throw new AppError('Time slot is already taken', 409);
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        ...data,
        status: BookingStatus.PENDING,
      },
    });
    
    // Send notifications
    await this.sendConfirmationEmail(booking);
    
    return booking;
  }
}
```

### Database (Prisma)

**Schema Design:**
```prisma
model Booking {
  id            String    @id @default(cuid())
  email         String
  name          String
  phone         String?
  scheduledFor  DateTime
  service       String
  status        BookingStatus @default(PENDING)
  notes         String?
  customerId    String?   @relation(fields: [customerId], references: [id])
  customer      Customer? @relation(fields: [customerId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([scheduledFor])
  @@index([status])
  @@map("bookings")
}
```

**Migrations:**
```bash
# Create migration
pnpm db:migration:add add_booking_status

# Apply migration
pnpm db:migrate:deploy

# Reset database (development only)
pnpm db:reset
```

## Testing

### Test Structure

```
src/
├── components/
│   └── Button.tsx
└── __tests__/
    ├── components/
    │   └── Button.test.tsx
    ├── services/
    │   └── booking.test.ts
    └── integration/
        └── bookings.test.ts
```

### Writing Tests

**Unit Tests:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={jest.fn()} disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

**Integration Tests:**
```typescript
import request from 'supertest';
import { app } from '../app';

describe('POST /api/bookings', () => {
  it('creates a booking with valid data', async () => {
    const bookingData = {
      email: 'test@example.com',
      name: 'Test User',
      scheduledFor: '2024-01-15T10:00:00Z',
      service: 'Hair Styling',
    };

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingData)
      .expect(201);

    expect(response.body.data.email).toBe(bookingData.email);
    expect(response.body.data.status).toBe('PENDING');
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test booking.test.ts
```

## Pull Request Process

### Before Submitting

1. **Run the full test suite:**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

2. **Update documentation:**
   - README.md if needed
   - API documentation for new endpoints
   - Component documentation for new UI components

3. **Ensure your branch is up to date:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Creating the Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a pull request:**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of the changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] All tests pass
   - [ ] New tests added
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

### Review Process

1. **Automated Checks:**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Security scanning

2. **Code Review:**
   - At least one team member must review
   - Address all review comments
   - Update based on feedback

3. **Approval and Merge:**
   - Get approval from maintainers
   - Merge using squash and merge
   - Delete feature branch

## Code Review Guidelines

### For Reviewers

**What to look for:**
- ✅ Functionality works as expected
- ✅ Code follows project standards
- ✅ Tests are comprehensive
- ✅ Documentation is clear
- ✅ No security vulnerabilities
- ✅ Performance considerations

**Review Process:**
1. **High-level review:** Understand the purpose and approach
2. **Code quality:** Check for clean, maintainable code
3. **Testing:** Verify test coverage and quality
4. **Documentation:** Ensure docs are updated
5. **Security:** Look for potential security issues

**Giving Feedback:**
- Be constructive and specific
- Explain the "why" behind suggestions
- Offer solutions, not just problems
- Be respectful and professional

### For Authors

**Responding to feedback:**
- Address all comments promptly
- Explain your reasoning if you disagree
- Update code based on suggestions
- Thank reviewers for their time

**Making updates:**
- Push new commits to the same branch
- Mark conversations as resolved
- Request re-review when ready

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 108]
- Version: [e.g. v1.2.3]

## Screenshots
Add screenshots if helpful

## Additional Context
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any other relevant information
```

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and considerate
- Use inclusive language
- Focus on constructive feedback
- Help others learn and grow
- Report inappropriate behavior

### Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/myglambeauty)
- **GitHub Discussions**: Start a [discussion](https://github.com/your-org/myglambeauty-supply/discussions)
- **Email**: Contact us at dev@myglambeauty.com

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Annual contributor highlights
- Special contributor badges

## Release Process

### Version Bumping

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update version numbers**
2. **Update CHANGELOG.md**
3. **Run full test suite**
4. **Create release tag**
5. **Deploy to staging**
6. **Run smoke tests**
7. **Deploy to production**
8. **Monitor for issues**

## Resources

### Documentation

- [Developer Guide](./developer-guide.md)
- [API Documentation](./api/README.md)
- [Database Schema](./database.md)
- [Deployment Guide](../DEPLOYMENT.md)

### Tools

- [VS Code Setup](./vscode-setup.md)
- [Testing Guidelines](./testing.md)
- [Security Checklist](./security.md)

### Community

- [Discord Server](https://discord.gg/myglambeauty)
- [GitHub Discussions](https://github.com/your-org/myglambeauty-supply/discussions)
- [Blog](https://blog.myglambeauty.com)

---

Thank you for contributing to MYGlamBeauty! Your contributions help make beauty salon management better for everyone. 🌟

If you have any questions, don't hesitate to reach out to the development team at dev@myglambeauty.com.
