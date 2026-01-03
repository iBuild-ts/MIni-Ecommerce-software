'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import { Button, Badge, formatPrice } from '@myglambeauty/ui';

const demoProducts = [
  { id: '1', name: 'Queen Mink Lashes', sku: 'QML-001', priceCents: 2499, stock: 150, status: 'active', category: 'Lashes', imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=200' },
  { id: '2', name: 'Princess Faux Mink Set', sku: 'PFM-002', priceCents: 3499, stock: 200, status: 'active', category: 'Lashes', imageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=200' },
  { id: '3', name: 'Natural Beauty Lashes', sku: 'NBL-003', priceCents: 1499, stock: 0, status: 'out_of_stock', category: 'Lashes', imageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=200' },
  { id: '4', name: 'Drama Queen Volume', sku: 'DQV-004', priceCents: 2999, stock: 100, status: 'active', category: 'Lashes', imageUrl: 'https://images.unsplash.com/photo-1588495752527-77d73a9a0b75?w=200' },
  { id: '5', name: 'Magnetic Lash Kit', sku: 'MLK-005', priceCents: 3999, stock: 80, status: 'active', category: 'Lashes', imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200' },
  { id: '6', name: 'Lash Adhesive', sku: 'LA-006', priceCents: 899, stock: 500, status: 'active', category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = demoProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500">
          <option>All Categories</option>
          <option>Lashes</option>
          <option>Accessories</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Out of Stock</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-lg">
          <span className="text-sm font-medium text-brand-700">
            {selectedProducts.length} selected
          </span>
          <Button variant="outline" size="sm">Bulk Edit</Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            Delete Selected
          </Button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(product.priceCents)}</td>
                <td className="px-6 py-4">
                  <span className={product.stock === 0 ? 'text-red-600' : 'text-gray-900'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={product.status === 'active' ? 'success' : 'danger'}>
                    {product.status === 'active' ? 'Active' : 'Out of Stock'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {demoProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
