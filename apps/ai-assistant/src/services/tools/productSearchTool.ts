const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  stock: number;
  category?: string;
  tags: string[];
}

class ProductSearchTool {
  async search(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/api/products?search=${encodeURIComponent(query)}&isActive=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Product search error:', error);
      return this.getFallbackProducts(query);
    }
  }

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_URL}/api/products/slug/${slug}`);
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Product fetch error:', error);
      return null;
    }
  }

  private getFallbackProducts(query: string): Product[] {
    const allProducts: Product[] = [
      { id: '1', name: 'Queen Mink Lashes', slug: 'queen-mink-lashes', description: 'Luxurious 3D mink lashes', priceCents: 2499, stock: 150, category: 'Lashes', tags: ['mink', 'luxury'] },
      { id: '2', name: 'Princess Faux Mink Set', slug: 'princess-faux-mink-set', description: 'Cruelty-free faux mink lashes', priceCents: 3499, stock: 200, category: 'Lashes', tags: ['faux-mink', 'vegan'] },
      { id: '3', name: 'Natural Beauty Lashes', slug: 'natural-beauty-lashes', description: 'Subtle, wispy lashes', priceCents: 1499, stock: 300, category: 'Lashes', tags: ['natural', 'everyday'] },
      { id: '4', name: 'Drama Queen Volume Lashes', slug: 'drama-queen-volume-lashes', description: 'Maximum volume and drama', priceCents: 2999, stock: 100, category: 'Lashes', tags: ['dramatic', 'volume'] },
      { id: '5', name: 'Magnetic Lash Kit', slug: 'magnetic-lash-kit', description: 'No glue needed magnetic lashes', priceCents: 3999, stock: 80, category: 'Lashes', tags: ['magnetic', 'easy'] },
      { id: '6', name: 'Lash Adhesive', slug: 'lash-adhesive-strong-hold', description: 'Professional-grade adhesive', priceCents: 899, stock: 500, category: 'Accessories', tags: ['adhesive', 'essential'] },
    ];

    const lowerQuery = query.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}

export const productSearchTool = new ProductSearchTool();
