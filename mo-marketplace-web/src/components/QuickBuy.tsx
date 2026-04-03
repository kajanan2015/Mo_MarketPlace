import { useState } from 'react';
import type { Product, Variant } from '../types';

interface Props {
  product: Product;
  variant: Variant;
  onClose: () => void;
}

export default function QuickBuy({ product, variant, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);

  const maxQty = Math.min(variant.stock, 10);

  const handleConfirm = () => {
    // Simulate order placement
    setOrdered(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (ordered) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Order Placed!</h2>
            <p>
              {quantity}x <strong>{product.name}</strong> ({variant.combinationKey})
            </p>
            <p className="order-total">Total: ${(variant.price * quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quick Buy</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="quickbuy-product">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="quickbuy-img" />
            )}
            <div className="quickbuy-info">
              <h3>{product.name}</h3>
              {product.category && <span className="badge">{product.category}</span>}
              <p className="quickbuy-variant">
                Variant: <strong>{variant.combinationKey}</strong>
              </p>
              <p className="quickbuy-price">${Number(variant.price).toFixed(2)} each</p>
              <p className="quickbuy-stock">{variant.stock} available</p>
            </div>
          </div>

          <div className="quickbuy-qty">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}>+</button>
            </div>
          </div>

          <div className="quickbuy-total">
            <span>Total:</span>
            <strong>${(variant.price * quantity).toFixed(2)}</strong>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
