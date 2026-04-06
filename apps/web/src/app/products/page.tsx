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
    const fetchProducts = async (retryCount = 0) => {
      setIsLoading(true);
      try {
        console.log('🔍 Fetching products from API...', `Attempt ${retryCount + 1}`);
        
        // Direct fetch to bypass any API wrapper issues
        const response = await fetch('https://mini-ecommerce-software.onrender.com/api/products?limit=200');
        const data = await response.json();
        
        console.log('✅ API Response:', data);
        
        const apiProducts = (data.products || []).map(product => {
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
        
        console.log('🛍️ Processed products:', apiProducts.length, apiProducts);
        setAllProducts(apiProducts);
        setProducts(apiProducts);
      } catch (error) {
        console.error('❌ Failed to fetch products:', error);
        console.error('Error details:', error);
        
        // Add fallback products for debugging
        const fallbackProducts = [
          {
            id: 'test-1',
            name: 'Darling Plush Cluster Lashes',
            slug: 'darling-plush-cluster-lashes',
            priceCents: 1199,
            mainImageUrl: 'https://image2url.com/r2/default/images/1770666436078-40ca0880-3194-40b8-b997-a636ff55a178.jpg',
            tags: ['Lashes'],
            category: 'Lashes',
            variants: '',
          },
          {
            id: 'test-2', 
            name: 'Soft Whispers Cluster Lashes',
            slug: 'soft-whispers-cluster-lashes',
            priceCents: 1199,
            mainImageUrl: 'https://image2url.com/r2/default/images/1770665944281-37ec18fe-3a3d-45c2-b2eb-1c104edc8825.jpg',
            tags: ['Lashes'],
            category: 'Lashes',
            variants: '',
          }
        ];
        
        console.log('🔄 Using fallback products:', fallbackProducts);
        setAllProducts(fallbackProducts);
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch with retry
    const fetchWithRetry = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await fetchProducts(i);
          return; // Success, exit retry loop
        } catch (error) {
          console.error(`Retry ${i + 1} failed:`, error);
          if (i === 2) {
            // Last retry failed, but don't clear products if we have them
            await fetchProducts(i);
            return;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    fetchWithRetry();
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
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setProducts(filtered);
  }, [allProducts, selectedCategory, selectedHairCategory, searchQuery]);

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

          {/* Main Category Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6 overflow-x-auto pb-2">
            {mainCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>

        {/* Hair Extensions Sub-Categories */}
        {selectedCategory === 'Hair Extensions' && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hairExtensionCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedHairCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedHairCategory === cat
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-500 mb-6">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
