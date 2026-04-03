import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const minPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => Number(v.price)))
    : null;

  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="product-card-img" />
      ) : (
        <div className="product-card-img-placeholder">
          <span>{product.name.charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div className="product-card-body">
        {product.category && <span className="badge">{product.category}</span>}
        <h3 className="product-card-name">{product.name}</h3>
        {product.description && (
          <p className="product-card-desc">{product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}</p>
        )}
        <div className="product-card-footer">
          {minPrice !== null ? (
            <span className="product-card-price">From ${minPrice.toFixed(2)}</span>
          ) : (
            <span className="product-card-price muted">No variants</span>
          )}
          <span className={`stock-badge ${inStock ? 'in' : 'out'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="product-card-variants">
          {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
}
