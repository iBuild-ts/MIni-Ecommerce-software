'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@myglambeauty/ui';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  mainImageUrl: string;
  tags: string[];
  category: string;
  variants?: string;
}

// Main category tabs
const mainCategories = ['All', 'Lashes', 'Accessories', 'Hair Extensions'];

// Hair Extensions sub-categories
const hairExtensionCategories = ['Bundles', 'Frontals', 'Closures', 'Wigs'];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHairCategory, setSelectedHairCategory] = useState('Bundles');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.getAll();
        
        const apiProducts = (response.products || []).map(product => {
          const tags = product.tags || [];
          const variantsTag = tags.find((t) => t.startsWith('variants:'));
          const variants = variantsTag ? variantsTag.slice('variants:'.length) : '';

          return ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          priceCents: product.priceCents,
          mainImageUrl: product.mainImageUrl || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
          tags,
          category: product.category || 'Uncategorized',
          variants,
        });
        });
        
        setAllProducts(apiProducts);
        setProducts(apiProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Show empty state when API fails
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

    if (selectedCategory === 'Hair Extensions') {
      // Filter by hair extension sub-category (Bundles, Frontals, Closures)
      filtered = filtered.filter((p) => p.category === selectedHairCategory);
    } else if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }

    setProducts(filtered);
  }, [allProducts, selectedCategory, selectedHairCategory, searchQuery]);

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop Our Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium beauty products and handmade lashes for the modern queen
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {mainCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Hair Extensions Sub-categories */}
          {selectedCategory === 'Hair Extensions' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap justify-center gap-2"
            >
              {hairExtensionCategories.map((subCategory) => (
                <button
                  key={subCategory}
                  onClick={() => setSelectedHairCategory(subCategory)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedHairCategory === subCategory
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {subCategory}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
