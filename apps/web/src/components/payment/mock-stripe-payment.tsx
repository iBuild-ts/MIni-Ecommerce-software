'use client';

import { useState } from 'react';
import { CreditCard, Lock, Check } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

interface MockStripePaymentProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  description: string;
}

export default function MockStripePayment({ 
  onSuccess, 
  onError, 
  amount, 
  description 
}: MockStripePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [expiry, setExpiry] = useState('12/25');
  const [cvc, setCvc] = useState('123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Simulate successful payment
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="w-full space-y-6">
      {description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            ${(amount / 100).toFixed(2)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Test Payment Mode</span>
          </div>
          <p className="text-xs text-blue-700">
            This is a demo payment. Use any card details - all payments succeed in test mode.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="123"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
