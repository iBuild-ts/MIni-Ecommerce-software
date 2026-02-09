const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

console.log('API_URL:', API_URL);

fetch(`${API_URL}/api/products`)
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
