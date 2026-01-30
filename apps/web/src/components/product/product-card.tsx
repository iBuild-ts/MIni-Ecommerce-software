'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@myglambeauty/ui';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    mainImageUrl?: string;
    tags?: string[];
    variants?: string;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.priceCents,
      imageUrl: product.mainImageUrl,
    });
  };

  const getBadge = () => {
    if (product.tags?.includes('bestseller')) return { text: 'Bestseller', color: 'bg-brand-500' };
    if (product.tags?.includes('new')) return { text: 'New', color: 'bg-gold-500' };
    if (product.tags?.includes('popular')) return { text: 'Popular', color: 'bg-purple-500' };
    return null;
  };

  const getWigPriceDisplay = () => {
    if (product.variants && product.category === 'Wigs') {
      return 'From ' + formatPrice(product.priceCents);
    }
    return formatPrice(product.priceCents);
  };

  const badge = getBadge();

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {badge && (
            <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${badge.color}`}>
              {badge.text}
            </span>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-brand-50 transition-colors"
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-brand-500 rounded-full shadow-md hover:bg-brand-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-brand-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-semibold text-brand-600">
            {getWigPriceDisplay()}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
