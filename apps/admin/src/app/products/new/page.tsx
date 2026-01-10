'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import { Button, Input } from '@myglambeauty/ui';

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    priceCents: '',
    compareAtPriceCents: '',
    category: 'Lashes',
    status: 'active',
    stock: '',
    tags: [] as string[],
    images: [] as File[],
  });
  const [newTag, setNewTag] = useState('');

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
      
      // Add images
      formData.images.forEach((image, index) => {
        productData.append('images', image);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/products`, {
        method: 'POST',
        body: productData,
      });

      if (response.ok) {
        alert('Product created successfully!');
        router.push('/products');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreviewMode(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Product Preview</h1>
          </div>
          <Button onClick={() => setPreviewMode(false)}>
            Edit Product
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {formData.images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(formData.images[0])}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.name || 'Product Name'}</h2>
              <p className="text-lg text-gray-500 mb-4">SKU: {formData.sku || 'N/A'}</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-brand-600">
                  ${formData.priceCents ? (parseInt(formData.priceCents) / 100).toFixed(2) : '0.00'}
                </span>
                {formData.compareAtPriceCents && (
                  <span className="text-xl text-gray-400 line-through">
                    ${(parseInt(formData.compareAtPriceCents) / 100).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{formData.description || 'Product description will appear here.'}</p>
              <div className="flex gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Stock: {formData.stock || '0'} | Category: {formData.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/products')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Auto-generated"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    value={formData.priceCents}
                    onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price ($)</label>
                  <Input
                    type="number"
                    value={formData.compareAtPriceCents}
                    onChange={(e) => setFormData({ ...formData, compareAtPriceCents: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
              >
                <option value="Lashes">Lashes</option>
                <option value="Accessories">Accessories</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
