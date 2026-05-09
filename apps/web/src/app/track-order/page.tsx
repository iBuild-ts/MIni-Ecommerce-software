// Updated: ${new Date().toISOString()} - Fixed Button component

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, ExternalLink, Phone, Mail, MapPin } from 'lucide-react';
import { Button, Input } from '@myglambeauty/ui';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResult({
        found: false,
        message: 'Order tracking is currently being migrated to a new platform. Please contact us directly for order updates.'
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">
            Enter your order number to track your package
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., ORD-12345)"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  Track Order
                </div>
              )}
            </Button>
          </form>

          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <p className="text-blue-800">{searchResult.message}</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternative Tracking Options</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-brand-500" />
                Third-Party Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                We're transitioning to a new tracking platform. In the meantime, you can track your package directly through:
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.ups.com/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-brand-600 hover:text-brand-700 font-medium"
                >
                  UPS Tracking <ExternalLink className="h-4 w-4 ml-1" />
                </a>
                <a
                  href="https://www.fedex.com/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-brand-600 hover:text-brand-700 font-medium"
                >
                  FedEx Tracking <ExternalLink className="h-4 w-4 ml-1" />
                </a>
                <a
                  href="https://www.usps.com/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-brand-600 hover:text-brand-700 font-medium"
                >
                  USPS Tracking <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Us Directly</h3>
              <p className="text-gray-600 mb-4">
                For immediate assistance with your order, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-brand-500" />
                  <span>786-985-6411</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-brand-500" />
                  <span>Myglambeauty@gmail.com</span>
                </div>
                <div className="flex items-start text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-brand-500 mt-1" />
                  <span>
                    7900 NW 27th ave<br />
                    Miami Florida 33147 FZ-3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Need help with something else?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <Button variant="outline">Contact Support</Button>
            </a>
            <a href="/faq">
              <Button variant="outline">View FAQ</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
