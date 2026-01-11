import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

// Simple in-memory user store for testing
interface User {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

const users: User[] = [];

export class SimpleAuthService {
  async login(email: string, password: string) {
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      passwordHash,
      name,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new AppError('User not found', 404);
    }

    if (data.name) {
      users[userIndex].name = data.name;
    }

    return {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      role: users[userIndex].role,
      createdAt: users[userIndex].createdAt,
    };
  }

  async forgotPassword(email: string) {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If an account exists, a reset link has been sent' };
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // In production, send email here
    console.log(`📧 Password reset token for ${email}: ${resetToken}`);

    return { message: 'If an account exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; purpose: string };
      
      if (decoded.purpose !== 'password_reset') {
        throw new AppError('Invalid reset token', 400);
      }

      const userIndex = users.findIndex(u => u.id === decoded.userId);
      if (userIndex === -1) {
        throw new AppError('User not found', 404);
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      users[userIndex].passwordHash = passwordHash;

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Reset token has expired', 400);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid reset token', 400);
      }
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].passwordHash);
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    users[userIndex].passwordHash = passwordHash;

    return { message: 'Password changed successfully' };
  }
}

export const simpleAuthService = new SimpleAuthService();
