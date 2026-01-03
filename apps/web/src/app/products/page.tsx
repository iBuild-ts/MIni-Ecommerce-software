'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@myglambeauty/ui';

const demoProducts = [
  {
    id: '1',
    name: 'Queen Mink Lashes',
    slug: 'queen-mink-lashes',
    priceCents: 2499,
    mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
    tags: ['bestseller', 'mink'],
    category: 'Lashes',
  },
  {
    id: '2',
    name: 'Princess Faux Mink Set',
    slug: 'princess-faux-mink-set',
    priceCents: 3499,
    mainImageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800',
    tags: ['new', 'faux-mink'],
    category: 'Lashes',
  },
  {
    id: '3',
    name: 'Natural Beauty Lashes',
    slug: 'natural-beauty-lashes',
    priceCents: 1499,
    mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800',
    tags: ['natural'],
    category: 'Lashes',
  },
  {
    id: '4',
    name: 'Drama Queen Volume Lashes',
    slug: 'drama-queen-volume-lashes',
    priceCents: 2999,
    mainImageUrl: 'https://images.unsplash.com/photo-1588495752527-77d73a9a0b75?w=800',
    tags: ['popular', 'dramatic'],
    category: 'Lashes',
  },
  {
    id: '5',
    name: 'Magnetic Lash Kit',
    slug: 'magnetic-lash-kit',
    priceCents: 3999,
    mainImageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800',
    tags: ['magnetic', 'kit'],
    category: 'Lashes',
  },
  {
    id: '6',
    name: 'Lash Adhesive - Strong Hold',
    slug: 'lash-adhesive-strong-hold',
    priceCents: 899,
    mainImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    tags: ['essential'],
    category: 'Accessories',
  },
  {
    id: '7',
    name: 'Lash Applicator Tool',
    slug: 'lash-applicator-tool',
    priceCents: 1299,
    mainImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    tags: ['tool'],
    category: 'Accessories',
  },
  {
    id: '8',
    name: 'Luxury Lash Storage Case',
    slug: 'luxury-lash-storage-case',
    priceCents: 1999,
    mainImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    tags: ['storage'],
    category: 'Accessories',
  },
];

const categories = ['All', 'Lashes', 'Accessories'];

export default function ProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = demoProducts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setProducts(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop Our Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of handcrafted lashes and beauty accessories
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-full"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Results Count */}
        <p className="text-gray-500 mb-6">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No products found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
