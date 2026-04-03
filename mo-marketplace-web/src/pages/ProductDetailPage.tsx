import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/products';
import VariantSelector from '../components/VariantSelector';
import QuickBuy from '../components/QuickBuy';
import { useAuth } from '../store/AuthContext';
import type { Product, Variant } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuickBuy, setShowQuickBuy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    productsApi
      .getOne(id)
      .then((p) => {
        setProduct(p);
        const firstInStock = p.variants.find((v) => v.stock > 0);
        setSelectedVariant(firstInStock || p.variants[0] || null);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!product || !confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await productsApi.delete(product.id);
      navigate('/');
    } catch {
      setError('Failed to delete product');
      setDeleting(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading product...</div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!product) return null;

  const canBuy = selectedVariant && selectedVariant.stock > 0;
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="btn btn-outline">← Back to Products</Link>
        {isAuthenticated && (
          <div className="action-group">
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        )}
      </div>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="image-placeholder">
              <span>{product.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          {product.category && <span className="badge badge-lg">{product.category}</span>}
          <h1 className="product-title">{product.name}</h1>

          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          {selectedVariant && (
            <div className="product-price">
              ${Number(selectedVariant.price).toFixed(2)}
            </div>
          )}

          <div className="section-divider" />

          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          <div className="product-actions">
            <button
              className="btn btn-primary btn-lg"
              disabled={!canBuy}
              onClick={() => setShowQuickBuy(true)}
              title={!inStock ? 'Out of stock' : !selectedVariant ? 'Select a variant' : ''}
            >
              {!inStock ? 'Out of Stock' : 'Quick Buy'}
            </button>
          </div>

          <div className="product-meta">
            <small className="muted">
              Added: {new Date(product.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>

      {/* Variants table */}
      {product.variants.length > 0 && (
        <div className="variants-table-section">
          <h2>All Variants</h2>
          <table className="variants-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Color</th>
                <th>Size</th>
                <th>Material</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v) => (
                <tr
                  key={v.id}
                  className={`${v.stock === 0 ? 'row-out-of-stock' : ''} ${selectedVariant?.id === v.id ? 'row-selected' : ''}`}
                  onClick={() => v.stock > 0 && setSelectedVariant(v)}
                >
                  <td><code>{v.combinationKey}</code></td>
                  <td>{v.color || '—'}</td>
                  <td>{v.size || '—'}</td>
                  <td>{v.material || '—'}</td>
                  <td>${Number(v.price).toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${v.stock > 0 ? 'in' : 'out'}`}>
                      {v.stock > 0 ? v.stock : 'Out of stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showQuickBuy && selectedVariant && (
        <QuickBuy
          product={product}
          variant={selectedVariant}
          onClose={() => setShowQuickBuy(false)}
        />
      )}
    </div>
  );
}
