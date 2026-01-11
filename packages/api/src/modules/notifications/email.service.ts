import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Check if email configuration is available
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured. Using mock email service.');
      this.isConfigured = false;
      return;
    }

    const config: EmailConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    this.transporter = nodemailer.createTransporter(config);
    this.isConfigured = true;
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured) {
      // Mock email sending for development
      console.log('📧 Mock Email Service:');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`HTML: ${options.html.substring(0, 100)}...`);
      
      return {
        success: true,
        messageId: `mock-${Date.now()}`,
      };
    }

    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@myglambeauty.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Email templates
  async sendBookingConfirmation(bookingData: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
    price: string;
    deposit?: string;
  }) {
    const subject = 'Booking Confirmation - MYGlamBeauty';
    const html = this.generateBookingConfirmationTemplate(bookingData);
    
    return this.sendEmail({
      to: bookingData.customerEmail,
      subject,
      html,
    });
  }

  async sendBookingReminder(bookingData: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
  }) {
    const subject = 'Appointment Reminder - MYGlamBeauty';
    const html = this.generateBookingReminderTemplate(bookingData);
    
    return this.sendEmail({
      to: bookingData.customerEmail,
      subject,
      html,
    });
  }

  async sendPaymentConfirmation(paymentData: {
    customerName: string;
    customerEmail: string;
    amount: number;
    bookingId: string;
    serviceName: string;
  }) {
    const subject = 'Payment Confirmation - MYGlamBeauty';
    const html = this.generatePaymentConfirmationTemplate(paymentData);
    
    return this.sendEmail({
      to: paymentData.customerEmail,
      subject,
      html,
    });
  }

  async sendOrderConfirmation(orderData: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const subject = 'Order Confirmation - MYGlamBeauty';
    const html = this.generateOrderConfirmationTemplate(orderData);
    
    return this.sendEmail({
      to: orderData.customerEmail,
      subject,
      html,
    });
  }

  async sendWelcomeEmail(customerData: {
    name: string;
    email: string;
  }) {
    const subject = 'Welcome to MYGlamBeauty!';
    const html = this.generateWelcomeTemplate(customerData);
    
    return this.sendEmail({
      to: customerData.email,
      subject,
      html,
    });
  }

  async sendPasswordResetEmail(data: {
    name: string;
    email: string;
    resetToken: string;
  }) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/reset-password?token=${data.resetToken}`;
    const subject = 'Reset Your Password - MYGlamBeauty';
    const html = this.generatePasswordResetTemplate({ ...data, resetUrl });
    
    return this.sendEmail({
      to: data.email,
      subject,
      html,
    });
  }

  private generatePasswordResetTemplate(data: { name: string; resetUrl: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .cta-button { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request 🔐</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password for your MYGlamBeauty account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${data.resetUrl}" class="cta-button">Reset Password</a>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link expires in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${data.resetUrl}</p>
            
            <p>Best regards,<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Email template generators
  private generateBookingConfirmationTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .cta-button { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! ✨</h1>
            <p>Thank you for choosing MYGlamBeauty</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            <p>Your appointment has been successfully booked! Here are your details:</p>
            
            <div class="booking-details">
              <h3>Appointment Details</h3>
              <div class="detail-row">
                <strong>Service:</strong>
                <span>${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <strong>Date:</strong>
                <span>${data.date}</span>
              </div>
              <div class="detail-row">
                <strong>Time:</strong>
                <span>${data.time}</span>
              </div>
              <div class="detail-row">
                <strong>Price:</strong>
                <span>${data.price}</span>
              </div>
              ${data.deposit ? `
              <div class="detail-row">
                <strong>Deposit Required:</strong>
                <span>${data.deposit}</span>
              </div>
              ` : ''}
            </div>

            <h3>Important Information</h3>
            <ul>
              <li>Please arrive 10 minutes early for your appointment</li>
              <li>Hair must be washed and completely dry before service</li>
              <li>Contact us at least 24 hours in advance for any changes</li>
            </ul>

            <a href="https://myglambeauty.com/account" class="cta-button">View Your Booking</a>
            
            <p>Need to make changes? Reply to this email or call us at (555) 123-4567</p>
            
            <p>Best regards,<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateBookingReminderTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Reminder ⏰</h1>
            <p>Don't forget your upcoming appointment!</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            
            <div class="reminder-box">
              <h3>Your Appointment Details</h3>
              <p><strong>Service:</strong> ${data.serviceName}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
            </div>

            <h3>Preparation Tips</h3>
            <ul>
              <li>Arrive 10 minutes early</li>
              <li>Bring reference photos if desired</li>
              <li>Remove any old lash extensions (if applicable)</li>
            </ul>

            <p>Need to reschedule? Reply to this email or call us at (555) 123-4567</p>
            
            <p>Can't wait to see you!<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePaymentConfirmationTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed! 💳</h1>
            <p>Thank you for your payment</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            
            <div class="payment-box">
              <h3>Payment Details</h3>
              <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
              <p><strong>Service:</strong> ${data.serviceName}</p>
              <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            </div>

            <p>Your payment has been successfully processed and your booking is confirmed!</p>
            
            <p>Questions? Reply to this email or call us at (555) 123-4567</p>
            
            <p>Best regards,<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOrderConfirmationTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed! 🛍️</h1>
            <p>Thank you for your purchase</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            
            <div class="order-box">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              
              <h4>Items:</h4>
              ${data.items.map((item: any) => `
                <div class="item-row">
                  <span>${item.name} x${item.quantity}</span>
                  <span>$${(item.price / 100).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="item-row" style="border-top: 2px solid #8b5cf6; font-weight: bold;">
                <span>Total</span>
                <span>$${(data.total / 100).toFixed(2)}</span>
              </div>
            </div>

            <p>Your order has been received and will be processed shortly. You'll receive another email when your order ships.</p>
            
            <p>Questions? Reply to this email or call us at (555) 123-4567</p>
            
            <p>Best regards,<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MYGlamBeauty</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .cta-button { background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MYGlamBeauty! 💎</h1>
            <p>We're so excited to have you join our community</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            
            <div class="welcome-box">
              <h3>What's Next?</h3>
              <ul>
                <li>📅 Book your first appointment and get 10% off</li>
                <li>🛍️ Shop our premium beauty products</li>
                <li>✨ Get exclusive access to member-only deals</li>
                <li>💇‍♀️ Earn points with every visit</li>
              </ul>
            </div>

            <p>Ready to get started? Book your first transformation today!</p>
            
            <a href="https://myglambeauty.com/booking" class="cta-button">Book Your First Appointment</a>
            
            <p>Have questions? Reply to this email or call us at (555) 123-4567</p>
            
            <p>Can't wait to meet you!<br>The MYGlamBeauty Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
