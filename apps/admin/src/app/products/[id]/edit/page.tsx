'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Upload, Plus, Star, Trash2 } from 'lucide-react';
import { Button, formatPrice } from '@myglambeauty/ui';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number;
  category: string;
  status: string;
  stock: number;
  tags: string[];
  mainImageUrl?: string;
  galleryImages?: ProductImage[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    priceCents: '',
    compareAtPriceCents: '',
    category: '',
    status: 'active',
    stock: '',
    tags: [] as string[],
    mainImageUrl: '',
  });

  // Image management state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [images, setImages] = useState<File[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setFormData({
            name: data.name || '',
            sku: data.sku || '',
            description: data.description || '',
            priceCents: data.priceCents ? (data.priceCents / 100).toString() : '',
            compareAtPriceCents: data.compareAtPriceCents ? (data.compareAtPriceCents / 100).toString() : '',
            category: data.category || '',
            status: data.isActive ? 'active' : 'inactive',
            stock: data.stock?.toString() || '',
            tags: data.tags || [],
            mainImageUrl: data.mainImageUrl || '',
          });
          
          // Load all images (main + gallery) into imageUrls
          const allImages: string[] = [];
          if (data.mainImageUrl) {
            allImages.push(data.mainImageUrl);
          }
          if (data.galleryImages && data.galleryImages.length > 0) {
            data.galleryImages.forEach((img: ProductImage) => {
              if (img.url && !allImages.includes(img.url)) {
                allImages.push(img.url);
              }
            });
          }
          setImageUrls(allImages);
        } else {
          alert('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        alert('Failed to load product');
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleSave = async () => {
    if (!formData.name || !formData.priceCents) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('sku', formData.sku);
      productData.append('description', formData.description);
      productData.append('priceCents', Math.round(parseFloat(formData.priceCents) * 100).toString());
      productData.append('compareAtPriceCents', formData.compareAtPriceCents ? Math.round(parseFloat(formData.compareAtPriceCents) * 100).toString() : '');
      productData.append('category', formData.category);
      productData.append('status', formData.status);
      productData.append('stock', formData.stock);
      productData.append('tags', JSON.stringify(formData.tags));
      
      // Add main image URL
      if (formData.mainImageUrl) {
        productData.append('mainImageUrl', formData.mainImageUrl);
      }
      
      // Add images
      images.forEach((image, index) => {
        productData.append('images', image);
      });

      const response = await fetch(`${API_URL}/api/products/${params.id}`, {
        method: 'PATCH',
        body: productData,
      });

      if (response.ok) {
        alert('Product updated successfully!');
        router.push('/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Add a new image URL to the list
  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedUrls = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedUrls);
      // If this is the first image, set it as main
      if (updatedUrls.length === 1) {
        setFormData({ ...formData, mainImageUrl: newImageUrl.trim() });
      }
      setNewImageUrl('');
    }
  };

  // Remove an image URL from the list
  const removeImageUrl = (urlToRemove: string) => {
    const updatedUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(updatedUrls);
    // If we removed the main image, set the first remaining as main
    if (formData.mainImageUrl === urlToRemove) {
      setFormData({ ...formData, mainImageUrl: updatedUrls[0] || '' });
    }
  };

  // Set an image as the cover/main image
  const setAsCover = (url: string) => {
    setFormData({ ...formData, mainImageUrl: url });
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      if (!formData.tags.includes(e.currentTarget.value.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, e.currentTarget.value.trim()],
        });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/products')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-500">Update product information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/products')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-brand-600 hover:bg-brand-700"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter SKU"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter product description"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.priceCents}
                onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare at Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.compareAtPriceCents}
                onChange={(e) => setFormData({ ...formData, compareAtPriceCents: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select category</option>
                <option value="Lashes">Lashes</option>
                <option value="Accessories">Accessories</option>
                <option value="Bundles">Hair Extensions - Bundles</option>
                <option value="Frontals">Hair Extensions - Frontals</option>
                <option value="Closures">Hair Extensions - Closures</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="0"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-brand-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags and press Enter"
              onKeyDown={addTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Add image URLs and click the star to set as cover image. The cover image will be shown on product listings.
            </p>
            
            {/* Add new image URL */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Paste image URL here..."
              />
              <Button
                type="button"
                onClick={addImageUrl}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Image Gallery */}
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => {
                  const isCover = formData.mainImageUrl === url;
                  return (
                    <div
                      key={index}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                        isCover ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL';
                          }}
                        />
                      </div>
                      
                      {/* Cover badge */}
                      {isCover && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          COVER
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => setAsCover(url)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 p-2 rounded-full transition-colors"
                            title="Set as cover"
                          >
                            <Star className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImageUrl(url)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-sm text-gray-400 mt-1">Paste an image URL above to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
