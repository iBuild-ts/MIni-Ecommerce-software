import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2">
              Join the Glam Squad
            </h3>
            <p className="text-brand-100 mb-6">
              Get exclusive offers, new arrivals, and beauty tips delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-brand-600 font-semibold rounded-full hover:bg-brand-50 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <div className="relative w-[70px] h-[70px] rounded-[70%] overflow-hidden">
                  <Image
                    src="https://image2url.com/r2/bucket3/images/1767997771278-7a3bc034-fad1-4f13-bd1e-48c88bf1c8a5.jpg"
                    alt="MYGlamBeauty Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Home of luxury beauty and handmade lashes for Queen Princess. Elevate your glam with our premium collection.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Shop All</Link></li>
                <li><Link href="/products?category=Lashes" className="text-gray-400 hover:text-white transition-colors">Lashes</Link></li>
                <li><Link href="/products?category=Accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
                <li><Link href="/booking" className="text-gray-400 hover:text-white transition-colors">Book Appointment</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Customer Service</h5>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Contact Us</h5>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="h-5 w-5 text-brand-400" />
                  <span>hello@myglambeauty.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-5 w-5 text-brand-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-brand-400 flex-shrink-0" />
                  <span>123 Beauty Lane<br />Los Angeles, CA 90001</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 MYGlamBeauty Supply. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
