import { stripe } from '../../config/stripe';
import { AppError } from '../../middleware/errorHandler';

type CartItem = {
  productId: string;
  quantity: number;
  variantLabel?: string;
  unitPriceCents?: number;
};

interface CheckoutData {
  items: CartItem[];
  customerEmail: string;
  customerName?: string;
  shippingAddress?: any;
  billingAddress?: any;
}

export class OrderService {
  async createCheckout(data: CheckoutData) {
    // Use Stripe with environment variable
    const subtotalCents = data.items.reduce((sum, item) => sum + (item.unitPriceCents || 0) * item.quantity, 0);
    const totalCents = subtotalCents;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: data.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.variantLabel ? `Product (${item.variantLabel})` : 'Product',
            description: `Quantity: ${item.quantity}`,
          },
          unit_amount: item.unitPriceCents || 0,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://m-ini-ecommerce-software-mmjgteuux-ibuildts-projects.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://m-ini-ecommerce-software-mmjgteuux-ibuildts-projects.vercel.app'}/cart`,
      customer_email: data.customerEmail,
      metadata: {
        customerName: data.customerName || '',
        items: JSON.stringify(data.items),
      },
    });

    return {
      clientSecret: session.id,
      url: session.url,
    };
  }

  async getAll(options?: {
    status?: string;
    customerId?: string;
    limit?: number;
    offset?: number;
  }) {
    // Return empty for now
    return { orders: [], total: 0 };
  }

  async getById(id: string) {
    // Return null for now
    return null;
  }

  async getStats() {
    // Return empty stats for now
    return {
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    };
  }

  async updateStatus(id: string, status: string) {
    // Do nothing for now
    return null;
  }

  async getByCustomerEmail(email: string) {
    // Return empty for now
    return { orders: [], total: 0 };
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    // Do nothing for now
    return null;
  }
}
