'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { Button, Badge, formatPrice } from '@myglambeauty/ui';
import { useCartStore } from '@/lib/store';

const demoProduct = {
  id: '1',
  name: 'Queen Mink Lashes',
  slug: 'queen-mink-lashes',
  description: 'Experience luxury with our signature Queen Mink Lashes. These premium 3D mink lashes are handcrafted to perfection, offering a natural yet glamorous look that lasts all day. Each pair is lightweight, comfortable, and reusable up to 25 times with proper care.',
  priceCents: 2499,
  compareAtPriceCents: 3499,
  mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
  galleryImages: [
    { id: '1', url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800', alt: 'Queen Mink Lashes front' },
    { id: '2', url: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800', alt: 'Queen Mink Lashes side' },
    { id: '3', url: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800', alt: 'Queen Mink Lashes detail' },
  ],
  tags: ['bestseller', 'mink', 'luxury'],
  category: 'Lashes',
  stock: 150,
  features: [
    '100% Siberian Mink fur',
    'Handcrafted with precision',
    'Reusable up to 25 times',
    'Lightweight and comfortable',
    'Natural-looking volume',
    'Cruelty-free sourced',
  ],
};

const reviews = [
  { id: 1, name: 'Sarah J.', rating: 5, comment: 'These lashes are absolutely stunning! So lightweight and natural-looking.', date: '2024-01-10' },
  { id: 2, name: 'Michelle W.', rating: 5, comment: 'Best lashes I\'ve ever purchased! The quality is amazing.', date: '2024-01-08' },
  { id: 3, name: 'Jessica D.', rating: 4, comment: 'Beautiful lashes, very easy to apply. Will buy again!', date: '2024-01-05' },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const product = demoProduct; // In production, fetch by params.slug

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        imageUrl: product.mainImageUrl,
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = product.compareAtPriceCents
    ? Math.round((1 - product.priceCents / product.compareAtPriceCents) * 100)
    : 0;

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-4">
          <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-500">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative"
            >
              <Image
                src={product.galleryImages[selectedImage]?.url || product.mainImageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <Badge variant="danger" className="absolute top-4 left-4">
                  -{discount}% OFF
                </Badge>
              )}
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-brand-50">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden relative border-2 transition-colors ${
                    selectedImage === index ? 'border-brand-500' : 'border-transparent'
                  }`}
                >
                  <Image src={image.url} alt={image.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.tags.includes('bestseller') && <Badge>Bestseller</Badge>}
              {product.tags.includes('new') && <Badge variant="gold">New</Badge>}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-brand-600">{formatPrice(product.priceCents)}</span>
              {product.compareAtPriceCents && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compareAtPriceCents)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 rounded-l-full"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 rounded-r-full"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Stock Status */}
            <p className="text-sm text-green-600 mb-6">
              ✓ In Stock ({product.stock} available)
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-brand-500 mb-2" />
                <p className="text-xs text-gray-600">Free Shipping<br />Over $50</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-brand-500 mb-2" />
                <p className="text-xs text-gray-600">Quality<br />Guaranteed</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-brand-500 mb-2" />
                <p className="text-xs text-gray-600">30-Day<br />Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{review.name}</span>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
