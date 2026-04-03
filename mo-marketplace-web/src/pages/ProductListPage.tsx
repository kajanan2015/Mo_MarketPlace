import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    productsApi
      .getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">{products.length} products available</p>
        </div>
        <Link to="/products/create" className="btn btn-primary">+ Add Product</Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
          <Link to="/products/create" className="btn btn-primary">Create your first product</Link>
        </div>
      )}

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
