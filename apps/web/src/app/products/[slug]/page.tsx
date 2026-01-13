'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { Button, Badge, formatPrice } from '@myglambeauty/ui';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';

const reviews = [
  { id: 1, name: 'Sarah J.', rating: 5, comment: 'Absolutely stunning quality! Will definitely buy again.', date: '2024-01-10' },
  { id: 2, name: 'Michelle W.', rating: 5, comment: 'Best purchase I\'ve made! The quality is amazing.', date: '2024-01-08' },
  { id: 3, name: 'Jessica D.', rating: 4, comment: 'Beautiful product, very easy to use. Highly recommend!', date: '2024-01-05' },
];

// Types for variants
interface VariantOption {
  value: string;
  label: string;
  priceCents?: number;
}

interface VariantGroup {
  type: string;
  label: string;
  options: VariantOption[];
}

interface VariantData {
  type: 'size' | 'multi';
  label?: string;
  options?: VariantOption[];
  groups?: VariantGroup[];
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addItem = useCartStore((state) => state.addItem);

  // Parse variants from product tags
  const variantData = useMemo<VariantData | null>(() => {
    if (!product?.tags) return null;
    const variantTag = product.tags.find((t: string) => t.startsWith('variants:'));
    if (!variantTag) return null;
    try {
      return JSON.parse(variantTag.replace('variants:', ''));
    } catch {
      return null;
    }
  }, [product?.tags]);

  // Calculate current price based on selected variants
  const currentPrice = useMemo(() => {
    if (!variantData || !product) return product?.priceCents || 0;

    if (variantData.type === 'size' && variantData.options) {
      const selectedSize = selectedVariants['size'];
      const option = variantData.options.find(o => o.value === selectedSize);
      return option?.priceCents || variantData.options[0]?.priceCents || product.priceCents;
    }

    if (variantData.type === 'multi' && variantData.groups) {
      const sizeGroup = variantData.groups.find(g => g.type === 'size');
      if (sizeGroup) {
        const selectedSize = selectedVariants['size'];
        const option = sizeGroup.options.find(o => o.value === selectedSize);
        return option?.priceCents || sizeGroup.options[0]?.priceCents || product.priceCents;
      }
    }

    return product.priceCents;
  }, [variantData, selectedVariants, product]);

  // Initialize default variant selections
  useEffect(() => {
    if (!variantData) return;

    const defaults: Record<string, string> = {};
    
    if (variantData.type === 'size' && variantData.options?.[0]) {
      defaults['size'] = variantData.options[0].value;
    }
    
    if (variantData.type === 'multi' && variantData.groups) {
      variantData.groups.forEach(group => {
        if (group.options?.[0]) {
          defaults[group.type] = group.options[0].value;
        }
      });
    }

    setSelectedVariants(defaults);
  }, [variantData]);

  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.products.getBySlug(params.slug);
        const transformedProduct = {
          id: response.id,
          name: response.name,
          slug: response.slug,
          description: response.description || 'Beautiful product from our collection',
          priceCents: response.priceCents,
          compareAtPriceCents: (response as any).compareAtPriceCents || null,
          mainImageUrl: response.mainImageUrl || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
          galleryImages: (response as any).galleryImages?.map((img: any) => ({
            id: img.id,
            url: img.url,
            alt: img.alt || img.name || 'Product image'
          })) || [
            { id: '1', url: response.mainImageUrl || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800', alt: response.name }
          ],
          tags: response.tags || [],
          category: response.category || 'Uncategorized',
          stock: response.stock || 0,
          features: (response as any).features || [
            'Premium quality materials',
            'Carefully crafted',
            'Beautiful design'
          ]
        };
        setProduct(transformedProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  // Build variant label for cart
  const getVariantLabel = () => {
    if (!variantData || Object.keys(selectedVariants).length === 0) return '';
    return Object.entries(selectedVariants)
      .map(([key, value]) => `${value}`)
      .join(' / ');
  };

  const handleAddToCart = () => {
    const variantLabel = getVariantLabel();
    const cartItemId = variantLabel ? `${product.id}-${variantLabel}` : product.id;
    const cartItemName = variantLabel ? `${product.name} (${variantLabel})` : product.name;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: cartItemId,
        name: cartItemName,
        slug: product.slug,
        priceCents: currentPrice,
        imageUrl: product.mainImageUrl,
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = product?.compareAtPriceCents
    ? Math.round((1 - currentPrice / product.compareAtPriceCents) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="pt-20 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <span className="text-3xl font-bold text-brand-600">{formatPrice(currentPrice)}</span>
              {product.compareAtPriceCents && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compareAtPriceCents)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Variant Selectors */}
            {variantData && (
              <div className="mb-6 space-y-4">
                {/* Single variant type (e.g., size only for Bundles) */}
                {variantData.type === 'size' && variantData.options && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Length
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variantData.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedVariants({ ...selectedVariants, size: option.value })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                            selectedVariants['size'] === option.value
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                          <span className="block text-xs mt-0.5 text-gray-500">
                            {formatPrice(option.priceCents || 0)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multi variant type (e.g., texture + size for Frontals) */}
                {variantData.type === 'multi' && variantData.groups && (
                  <>
                    {variantData.groups.map((group) => (
                      <div key={group.type}>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Select {group.label}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {group.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedVariants({ ...selectedVariants, [group.type]: option.value })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                                selectedVariants[group.type] === option.value
                                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option.label}
                              {option.priceCents && (
                                <span className="block text-xs mt-0.5 text-gray-500">
                                  {formatPrice(option.priceCents)}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

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
