'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button, formatPrice } from '@myglambeauty/ui';
import { useCartStore } from '@/lib/store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutData {
  clientSecret: string;
  orderId: string;
  total: number;
}

function CheckoutForm({ checkoutData }: { checkoutData: CheckoutData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCartStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        checkoutData.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Clear cart and show success
        clearCart();
        sessionStorage.removeItem('checkoutData');
        setIsComplete(true);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Order ID: {checkoutData.orderId}
        </p>
        <div className="space-x-4">
          <Link href="/account">
            <Button>View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Card Details
        </label>
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-brand-600">
            {formatPrice(checkoutData.total)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Pay {formatPrice(checkoutData.total)}
          </div>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
        <Lock className="h-3 w-3" />
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData');
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      router.push('/cart');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-500 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
            <p className="text-gray-600 mt-2">Enter your payment details below</p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm checkoutData={checkoutData} />
          </Elements>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? <a href="mailto:support@myglambeauty.com" className="text-brand-500 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
