'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading ALL products from SHOP page...');
        const response = await fetch('https://mini-ecommerce-software.onrender.com/api/products?limit=100');
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Products found:', data.products?.length || 0);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
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
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Shop All Products ({products.length})</h1>
      
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
        <p style={{ color: '#666', marginBottom: '20px' }}>
          <strong>MYGlamBeauty Supply</strong> - All {products.length} original products loaded successfully!
        </p>
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
