import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { productsApi } from '../api/products';
import { useAuth } from '../store/AuthContext';

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  price: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Price must be non-negative'),
  stock: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Stock must be non-negative'),
});

const schema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  variants: z.array(variantSchema),
});

type FormData = z.infer<typeof schema>;
type VariantFormData = z.infer<typeof variantSchema>;

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { variants: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="alert alert-error">
          You must be <Link to="/login">logged in</Link> to create products.
        </div>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    setServerError('');
    try {
      const payload = {
        ...data,
        imageUrl: data.imageUrl || undefined,
        variants: (data.variants as VariantFormData[]).map((v) => ({
          color: v.color || undefined,
          size: v.size || undefined,
          material: v.material || undefined,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };
      const product = await productsApi.create(payload);
      navigate(`/products/${product.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create product');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Create Product</h1>
          <p className="subtitle">Add a new product with variants</p>
        </div>
        <Link to="/" className="btn btn-outline">← Back</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form card">
        <h2 className="section-title">Product Details</h2>

        <div className="form-row">
          <div className="form-group flex-2">
            <label>Product Name *</label>
            <input {...register('name')} placeholder="e.g. Classic Cotton T-Shirt" />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          <div className="form-group flex-1">
            <label>Category</label>
            <input {...register('category')} placeholder="e.g. Apparel" />
            {errors.category && <span className="error">{errors.category.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register('description')} placeholder="Product description..." rows={3} />
          {errors.description && <span className="error">{errors.description.message}</span>}
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input {...register('imageUrl')} placeholder="https://example.com/image.jpg" />
          {errors.imageUrl && <span className="error">{errors.imageUrl.message}</span>}
        </div>

        <div className="section-divider" />

        <div className="section-header">
          <h2 className="section-title">Variants</h2>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => append({ color: '', size: '', material: '', price: '0', stock: '0' } as any)}
          >
            + Add Variant
          </button>
        </div>

        {fields.length === 0 && (
          <p className="muted text-center">No variants added yet. Click "+ Add Variant" to add one.</p>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="variant-form-row card-inner">
            <div className="variant-form-header">
              <span className="variant-index">Variant #{idx + 1}</span>
              <button type="button" className="btn-icon danger" onClick={() => remove(idx)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Color</label>
                <input {...register(`variants.${idx}.color`)} placeholder="e.g. red" />
              </div>
              <div className="form-group flex-1">
                <label>Size</label>
                <input {...register(`variants.${idx}.size`)} placeholder="e.g. M" />
              </div>
              <div className="form-group flex-1">
                <label>Material</label>
                <input {...register(`variants.${idx}.material`)} placeholder="e.g. cotton" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Price *</label>
                <input {...register(`variants.${idx}.price`)} type="number" step="0.01" min="0" placeholder="0.00" />
                {errors.variants?.[idx]?.price && (
                  <span className="error">{errors.variants[idx]?.price?.message}</span>
                )}
              </div>
              <div className="form-group flex-1">
                <label>Stock *</label>
                <input {...register(`variants.${idx}.stock`)} type="number" min="0" placeholder="0" />
                {errors.variants?.[idx]?.stock && (
                  <span className="error">{errors.variants[idx]?.stock?.message}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <div className="form-actions">
          <Link to="/" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
