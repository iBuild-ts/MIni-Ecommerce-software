'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorkingProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading ALL products...');
        const response = await fetch('https://mini-ecommerce-software.onrender.com/api/products?limit=100');
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Products found:', data.products?.length || 0);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
        // Add fallback to ensure some products show
        const fallbackProducts = [
          {
            id: 'fallback-1',
            name: 'Darling Plush Cluster Lashes',
            slug: 'darling-plush-cluster-lashes',
            priceCents: 1199,
            mainImageUrl: 'https://image2url.com/r2/default/images/1770666436078-40ca0880-3194-40b8-b997-a636ff55a178.jpg',
            category: 'Lashes'
          },
          {
            id: 'fallback-2',
            name: '5x5 Closure HD Lace',
            slug: '5x5-closure-hd-lace',
            priceCents: 8000,
            mainImageUrl: 'https://image2url.com/r2/default/images/1769786948087-d34e3d15-8eac-45c5-a6e5-e5c243532fe6.jpg',
            category: 'Closures'
          }
        ];
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Loading Products...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>All Products ({products.length})</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white'
          }}>
            <img 
              src={product.mainImageUrl} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '4px',
                marginBottom: '15px'
              }}
            />
            
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{product.name}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
              {product.category}
            </p>
            <p style={{ 
              margin: '0 0 15px 0', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              ${(product.priceCents / 100).toFixed(2)}
            </p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href={`/products/${product.slug}`}>
                <button style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  View Details
                </button>
              </Link>
              
              <button style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link href="/products">
          <button style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Back to Main Products Page
          </button>
        </Link>
      </div>
    </div>
  );
}
