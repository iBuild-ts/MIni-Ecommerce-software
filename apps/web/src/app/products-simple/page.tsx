'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  mainImageUrl: string;
  category: string;
}

export default function SimpleProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mini-ecommerce-software.onrender.com/api/products?limit=20')
      .then(res => res.json())
      .then(data => {
        console.log('Products data:', data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products ({products.length})</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img 
              src={product.mainImageUrl} 
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3>{product.name}</h3>
            <p><strong>Price:</strong> ${(product.priceCents / 100).toFixed(2)}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <button 
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = `/products/${product.slug}`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
