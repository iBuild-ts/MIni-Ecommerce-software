import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@myglambeauty/db';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { emailService } from '../notifications/email.service';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

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
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'CUSTOMER', // Default role for new registrations
      },
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({
        name: name || 'Valued Customer',
        email,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the registration if email fails
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

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
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

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail({
        name: user.name || 'Customer',
        email: user.email,
        resetToken,
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      throw new AppError('Failed to send reset email', 500);
    }

    return { message: 'If an account exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; purpose: string };
      
      if (decoded.purpose !== 'password_reset') {
        throw new AppError('Invalid reset token', 400);
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash },
      });

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
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}

export const authService = new AuthService();
