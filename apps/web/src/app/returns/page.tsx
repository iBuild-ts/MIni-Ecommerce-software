'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

export default function ReturnsPage() {
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    reason: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Return Request Received!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you! Your return request has been submitted. We'll process it within 2-3 business days.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Submit Another Return
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600">
            Our return policy and how to initiate a return or exchange
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Return Policy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Return Policy</h2>
                <p className="text-gray-600">Simple and hassle-free</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Timeframe</h3>
                <p className="text-gray-600">
                  Returns are accepted within <strong>14 days</strong> of purchase date.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Condition</h3>
                <p className="text-gray-600">
                  Items must be <strong>unused</strong> and in <strong>original packaging</strong>.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Refunds</h3>
                <p className="text-gray-600">
                  Refunds are processed within <strong>5-7 business days</strong> after we receive the returned item.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exchanges</h3>
                <p className="text-gray-600">
                  Exchanges are available for different sizes or colors of the same product.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
                <p className="text-gray-600">
                  Return shipping is the customer's responsibility unless the item is defective.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Return Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Initiate Return</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number *
                </label>
                <input
                  id="orderNumber"
                  name="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="ORD-12345"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Return Reason *
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select a reason</option>
                  <option value="wrong-size">Wrong Size</option>
                  <option value="wrong-color">Wrong Color</option>
                  <option value="defective">Defective Product</option>
                  <option value="not-as-described">Not as Described</option>
                  <option value="changed-mind">Changed Mind</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 resize-none"
                  placeholder="Please provide any additional details..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Package className="h-5 w-5 mr-2" />
                    Submit Return Request
                  </div>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-brand-100 mb-6">
              Have questions about your return? Contact our customer service team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact-us">
                <Button variant="secondary">Contact Support</a>
              </a>
              <a href="/track-order">
                <Button variant="secondary">Track Order</Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
