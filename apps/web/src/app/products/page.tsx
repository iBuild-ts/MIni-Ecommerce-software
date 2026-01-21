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
}

// Main category tabs
const mainCategories = ['All', 'Lashes', 'Accessories', 'Hair Extensions'];

// Hair Extensions sub-categories
const hairExtensionCategories = ['Bundles', 'Frontals', 'Closures'];

// Fallback demo products when API is unavailable
const demoProducts: Product[] = [
  { id: '1', name: 'Brazilian Body Wave Bundle', slug: 'brazilian-body-wave', priceCents: 12999, mainImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', tags: ['bestseller'], category: 'Bundles' },
  { id: '2', name: 'Peruvian Straight Bundle', slug: 'peruvian-straight', priceCents: 11999, mainImageUrl: 'https://images.unsplash.com/photo-1595499280052-76bc16cd7c71?w=800', tags: ['new'], category: 'Bundles' },
  { id: '3', name: 'Malaysian Curly Bundle', slug: 'malaysian-curly', priceCents: 13999, mainImageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800', tags: ['popular'], category: 'Bundles' },
  { id: '4', name: 'HD Lace Frontal 13x4', slug: 'hd-lace-frontal', priceCents: 8999, mainImageUrl: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800', tags: ['bestseller'], category: 'Frontals' },
  { id: '5', name: 'Swiss Lace Closure 4x4', slug: 'swiss-lace-closure', priceCents: 5999, mainImageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800', tags: ['new'], category: 'Closures' },
  { id: '6', name: 'Mink 3D Lashes - Natural', slug: 'mink-3d-lashes-natural', priceCents: 1999, mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800', tags: ['bestseller'], category: 'Lashes' },
  { id: '7', name: 'Mink 3D Lashes - Dramatic', slug: 'mink-3d-lashes-dramatic', priceCents: 2499, mainImageUrl: 'https://images.unsplash.com/photo-1597225182391-d7ad7fba9866?w=800', tags: ['popular'], category: 'Lashes' },
  { id: '8', name: 'Faux Mink Lashes Set', slug: 'faux-mink-set', priceCents: 1499, mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800', tags: ['new'], category: 'Lashes' },
  { id: '9', name: 'Lash Glue - Waterproof', slug: 'lash-glue-waterproof', priceCents: 899, mainImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', tags: [], category: 'Accessories' },
  { id: '10', name: 'Wig Cap - Mesh', slug: 'wig-cap-mesh', priceCents: 599, mainImageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800', tags: [], category: 'Accessories' },
  { id: '11', name: 'Edge Control Gel', slug: 'edge-control-gel', priceCents: 1299, mainImageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800', tags: ['bestseller'], category: 'Accessories' },
  { id: '12', name: 'Vietnamese Raw Hair Bundle', slug: 'vietnamese-raw-hair', priceCents: 19999, mainImageUrl: 'https://images.unsplash.com/photo-1605980625600-88d6cf1ddd9f?w=800', tags: ['new', 'premium'], category: 'Bundles' },
];

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
        const response = await api.products.getAll({ limit: 200 });
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
        console.error('Failed to fetch products, using demo data:', error);
        // Use demo products as fallback when API is unavailable
        setAllProducts(demoProducts);
        setProducts(demoProducts);
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
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {mainCategories.map((category) => (
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

        </div>

        {/* Hair Extensions Sub-Categories */}
        {selectedCategory === 'Hair Extensions' && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hairExtensionCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedHairCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
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
