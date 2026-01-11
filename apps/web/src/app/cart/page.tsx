'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, User, Lock } from 'lucide-react';
import { Button, formatPrice } from '@myglambeauty/ui';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalCents, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getTotalCents();
  const shipping = subtotal >= 5000 ? 0 : 499;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Redirect to login page with checkout intent
      window.location.href = '/login?redirect=/cart';
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // Create checkout with Stripe
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          customerEmail: user?.email || '',
          customerName: user?.name || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      const { clientSecret, order } = await response.json();
      
      // Store checkout data and redirect to checkout page
      sessionStorage.setItem('checkoutData', JSON.stringify({
        clientSecret,
        orderId: order.id,
        total: order.totalCents,
      }));
      
      window.location.href = '/checkout';
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any items yet.</p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-500 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="hover:text-brand-500">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-brand-600 mt-1">
                      {formatPrice(item.priceCents)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 rounded-l-full"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 rounded-r-full"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-xs text-gray-400">
                    Add {formatPrice(5000 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-brand-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                isLoading={isCheckingOut}
                className="w-full mt-6"
                size="lg"
              >
                {isAuthenticated ? (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Sign In to Checkout
                  </>
                )}
              </Button>

              {!isAuthenticated && (
                <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-200">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-brand-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-brand-900">Sign in required</p>
                      <p className="text-sm text-brand-700 mt-1">
                        Create an account or sign in to complete your purchase and track your order.
                      </p>
                      <Link href="/account?redirect=checkout">
                        <Button variant="outline" size="sm" className="mt-2">
                          Sign In / Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✅ Signed in as {user?.email}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                Secure checkout powered by Stripe
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700">Promo Code</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
