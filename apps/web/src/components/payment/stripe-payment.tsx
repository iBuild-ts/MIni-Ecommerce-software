'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount?: number;
  description?: string;
}

function PaymentForm({ clientSecret, onSuccess, onError, amount, description }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) return;

    const element = elements.getElement('payment');
    if (element) {
      element.focus();
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        onError(error.message || 'An error occurred');
      } else {
        onError('An unexpected error occurred');
      }
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      {description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{description}</p>
          {amount && (
            <p className="text-lg font-semibold text-gray-900 mt-2">
              ${(amount / 100).toFixed(2)}
            </p>
          )}
        </div>
      )}

      <PaymentElement 
        options={{
          layout: 'tabs'
        }}
        className="min-h-[200px]"
      />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-brand-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${amount ? `$${(amount / 100).toFixed(2)}` : ''}`
          )}
        </span>
      </button>

      {/* Show any error or success messages */}
      <div id="payment-message" className="hidden"></div>
    </form>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount?: number;
  description?: string;
}

export default function StripePayment({ 
  clientSecret, 
  onSuccess, 
  onError, 
  amount, 
  description 
}: StripePaymentProps) {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ec4899',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onError={onError}
            amount={amount}
            description={description}
          />
        </Elements>
      )}
    </div>
  );
}
