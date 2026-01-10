'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@myglambeauty/ui';
import { api } from '@/lib/api';

const categories = ['All', 'Lashes', 'Accessories'];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.getAll();
        // Transform API products to match frontend expected type
        const apiProducts = (response.products || []).map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          priceCents: product.priceCents,
          mainImageUrl: product.mainImageUrl || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
          tags: product.tags || [],
          category: product.category || 'Uncategorized'
        }));
        
        setAllProducts(apiProducts);
        setProducts(apiProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Keep empty state if API fails
        setAllProducts([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p: any) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t: string) => t.toLowerCase().includes(query))
      );
    }

    setProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery]);

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
