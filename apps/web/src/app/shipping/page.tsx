'use client';

import { motion } from 'framer-motion';
import { Truck, Package, Clock, Shield, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about our shipping policies and delivery options
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Standard Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-100 rounded-full mr-4">
                <Truck className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Standard Shipping</h2>
                <p className="text-gray-600">Our most popular shipping option</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                  <p className="text-gray-600">5-7 business days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-600">$9.99</p>
                  <p className="text-sm text-gray-500">Free on orders $75+</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Tracking</h3>
                  <p className="text-gray-600">Full tracking included</p>
                </div>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Express Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Express Shipping</h2>
                <p className="text-gray-600">When you need it fast</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                  <p className="text-gray-600">2-3 business days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">$19.99</p>
                  <p className="text-sm text-gray-500">Priority processing</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Tracking</h3>
                  <p className="text-gray-600">Real-time tracking updates</p>
                </div>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* International Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">International Shipping</h2>
                <p className="text-gray-600">We ship worldwide!</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                  <p className="text-gray-600">10-15 business days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">$29.99</p>
                  <p className="text-sm text-gray-500">Varies by location</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Customs & Duties</h3>
                  <p className="text-gray-600">Customer responsible for import fees</p>
                </div>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Shipping Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policies</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600">
                  Orders are typically processed within 1-2 business days. You'll receive a confirmation email 
                  with tracking information once your order ships.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-gray-600">
                  We ship to the address provided at checkout. Please ensure your shipping information is 
                  accurate as we cannot modify addresses once an order has been processed.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Lost or Damaged Packages</h3>
                <p className="text-gray-600">
                  In the rare event your package is lost or arrives damaged, please contact us within 
                  48 hours of delivery. We'll work with you to resolve the issue promptly.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Local Pickup</h3>
                <p className="text-gray-600">
                  Local pickup is available at our Miami location. Select "Local Pickup" at checkout 
                  and we'll notify you when your order is ready for collection.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Questions About Shipping?</h2>
            <p className="text-brand-100 mb-6">
              Our customer service team is here to help with any shipping questions you may have.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>786-985-6411</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>Myglambeauty@gmail.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1" />
                <span>
                  7900 NW 27th ave<br />
                  Miami Florida 33147 FZ-3
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="secondary" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
