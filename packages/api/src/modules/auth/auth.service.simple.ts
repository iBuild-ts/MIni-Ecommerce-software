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
}

export const simpleAuthService = new SimpleAuthService();
