import type { Variant } from '../types';

interface Props {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

function groupVariantsByAttr(variants: Variant[], attr: keyof Variant) {
  return Array.from(new Set(variants.map((v) => v[attr] as string).filter(Boolean)));
}

export default function VariantSelector({ variants, selectedVariant, onSelect }: Props) {
  if (!variants.length) return <p className="no-variants">No variants available.</p>;

  const colors = groupVariantsByAttr(variants, 'color');
  const sizes = groupVariantsByAttr(variants, 'size');
  const materials = groupVariantsByAttr(variants, 'material');

  const selectedColor = selectedVariant?.color;
  const selectedSize = selectedVariant?.size;
  const selectedMaterial = selectedVariant?.material;

  const findVariant = (color?: string, size?: string, material?: string): Variant | undefined =>
    variants.find(
      (v) =>
        (!colors.length || v.color === color) &&
        (!sizes.length || v.size === size) &&
        (!materials.length || v.material === material),
    );

  const handleColorClick = (color: string) => {
    const v = findVariant(color, selectedSize, selectedMaterial) || variants.find((v) => v.color === color);
    if (v) onSelect(v);
  };

  const handleSizeClick = (size: string) => {
    const v = findVariant(selectedColor, size, selectedMaterial) || variants.find((v) => v.size === size);
    if (v) onSelect(v);
  };

  const handleMaterialClick = (material: string) => {
    const v = findVariant(selectedColor, selectedSize, material) || variants.find((v) => v.material === material);
    if (v) onSelect(v);
  };

  const isOutOfStock = (variant: Variant | undefined) => !variant || variant.stock === 0;

  return (
    <div className="variant-selector">
      {colors.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">Color</label>
          <div className="variant-options">
            {colors.map((color) => {
              const v = variants.find((vv) => vv.color === color);
              const outOfStock = isOutOfStock(v);
              return (
                <button
                  key={color}
                  className={`variant-btn ${selectedColor === color ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                  onClick={() => !outOfStock && handleColorClick(color)}
                  disabled={outOfStock}
                  title={outOfStock ? 'Out of stock' : color}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">Size</label>
          <div className="variant-options">
            {sizes.map((size) => {
              const v = variants.find((vv) => vv.size === size && (!selectedColor || vv.color === selectedColor));
              const outOfStock = isOutOfStock(v);
              return (
                <button
                  key={size}
                  className={`variant-btn ${selectedSize === size ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                  onClick={() => !outOfStock && handleSizeClick(size)}
                  disabled={outOfStock}
                  title={outOfStock ? 'Out of stock' : size}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">Material</label>
          <div className="variant-options">
            {materials.map((material) => {
              const v = variants.find((vv) => vv.material === material);
              const outOfStock = isOutOfStock(v);
              return (
                <button
                  key={material}
                  className={`variant-btn ${selectedMaterial === material ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                  onClick={() => !outOfStock && handleMaterialClick(material)}
                  disabled={outOfStock}
                  title={outOfStock ? 'Out of stock' : material}
                >
                  {material}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <div className="variant-info">
          <span className="variant-key">SKU: {selectedVariant.combinationKey}</span>
          <span className={`variant-stock ${selectedVariant.stock === 0 ? 'out' : 'in'}`}>
            {selectedVariant.stock === 0 ? 'Out of stock' : `${selectedVariant.stock} in stock`}
          </span>
        </div>
      )}
    </div>
  );
}
