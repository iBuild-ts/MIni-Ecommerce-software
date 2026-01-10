import { Request, Response } from 'express';
import { emailService } from './email.service';

export class NotificationController {
  // Send booking confirmation
  async sendBookingConfirmation(req: Request, res: Response) {
    try {
      const { customerName, customerEmail, serviceName, date, time, price, deposit } = req.body;

      if (!customerName || !customerEmail || !serviceName || !date || !time || !price) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const result = await emailService.sendBookingConfirmation({
        customerName,
        customerEmail,
        serviceName,
        date,
        time,
        price,
        deposit,
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send booking confirmation',
      });
    }
  }

  // Send booking reminder
  async sendBookingReminder(req: Request, res: Response) {
    try {
      const { customerName, customerEmail, serviceName, date, time } = req.body;

      if (!customerName || !customerEmail || !serviceName || !date || !time) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const result = await emailService.sendBookingReminder({
        customerName,
        customerEmail,
        serviceName,
        date,
        time,
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending booking reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send booking reminder',
      });
    }
  }

  // Send payment confirmation
  async sendPaymentConfirmation(req: Request, res: Response) {
    try {
      const { customerName, customerEmail, amount, bookingId, serviceName } = req.body;

      if (!customerName || !customerEmail || !amount || !bookingId || !serviceName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const result = await emailService.sendPaymentConfirmation({
        customerName,
        customerEmail,
        amount,
        bookingId,
        serviceName,
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send payment confirmation',
      });
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(req: Request, res: Response) {
    try {
      const { customerName, customerEmail, orderId, total, items } = req.body;

      if (!customerName || !customerEmail || !orderId || !total || !items) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const result = await emailService.sendOrderConfirmation({
        customerName,
        customerEmail,
        orderId,
        total,
        items,
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send order confirmation',
      });
    }
  }

  // Send welcome email
  async sendWelcomeEmail(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const result = await emailService.sendWelcomeEmail({
        name,
        email,
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send welcome email',
      });
    }
  }

  // Test email endpoint
  async testEmail(req: Request, res: Response) {
    try {
      const { to } = req.body;

      if (!to) {
        return res.status(400).json({
          success: false,
          error: 'Email address is required',
        });
      }

      const result = await emailService.sendEmail({
        to,
        subject: 'Test Email from MYGlamBeauty',
        html: `
          <h1>Test Email</h1>
          <p>This is a test email from the MYGlamBeauty notification system.</p>
          <p>If you received this, the email service is working correctly!</p>
        `,
        text: 'This is a test email from the MYGlamBeauty notification system.',
      });

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
          message: 'Test email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send test email',
      });
    }
  }
}
