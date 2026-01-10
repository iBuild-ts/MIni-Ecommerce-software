'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import { Button } from '@myglambeauty/ui';
import MockStripePayment from './mock-stripe-payment';
import { api } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    id: string;
    service: {
      name: string;
      price: string;
      deposit?: string;
    };
    customer: {
      name: string;
      email: string;
    };
    date: string;
    time: string;
  };
  onSuccess: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  bookingData, 
  onSuccess 
}: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<'deposit' | 'confirmation'>('deposit');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const depositAmount = bookingData.service.deposit 
    ? parseInt(bookingData.service.deposit.replace(/[^0-9]/g, '')) * 100
    : 1000; // Default $10 deposit

  const initializePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For mock payment, we don't need to initialize actual payment
      // Just set a small delay to simulate initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClientSecret('mock-initialized');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStep('confirmation');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
    return numericPrice > 0 ? `$${numericPrice.toFixed(2)}` : 'Price varies';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {paymentStep === 'deposit' ? 'Complete Your Booking' : 'Payment Confirmed!'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {paymentStep === 'deposit' ? 'Secure payment processing' : 'Your appointment is confirmed'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {paymentStep === 'deposit' && (
                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium">{bookingData.service.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{bookingData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{bookingData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-medium">{formatPrice(bookingData.service.price)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-900 font-medium">Deposit Required:</span>
                          <span className="font-bold text-brand-600">
                            ${(depositAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">Secure Payment</p>
                          <p className="text-blue-700 mt-1">
                            Your payment information is encrypted and secure. 
                            The remaining balance will be due at your appointment.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    {/* Payment Form */}
                    {!clientSecret ? (
                      <div className="text-center py-8">
                        <Button
                          onClick={initializePayment}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Initializing Payment...
                            </div>
                          ) : (
                            `Pay Deposit - $${(depositAmount / 100).toFixed(2)}`
                          )}
                        </Button>
                      </div>
                    ) : (
                      <MockStripePayment
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        amount={depositAmount}
                        description={`Deposit for ${bookingData.service.name}`}
                      />
                    )}
                  </div>
                )}

                {paymentStep === 'confirmation' && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-green-600" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your deposit of ${(depositAmount / 100).toFixed(2)} has been processed.
                      Your booking is confirmed and you'll receive a confirmation email shortly.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <h4 className="font-medium text-gray-900 mb-2">Appointment Details:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Service:</strong> {bookingData.service.name}</p>
                        <p><strong>Date:</strong> {bookingData.date}</p>
                        <p><strong>Time:</strong> {bookingData.time}</p>
                        <p><strong>Remaining Balance:</strong> {formatPrice(bookingData.service.price)}</p>
                      </div>
                    </div>

                    <Button onClick={handleComplete} className="w-full">
                      View My Bookings
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
