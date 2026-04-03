export interface Variant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  stock: number;
  combinationKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface CreateVariantInput {
  color?: string;
  size?: string;
  material?: string;
  price: number;
  stock: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  variants?: CreateVariantInput[];
}

export interface QuickBuyOrder {
  product: Product;
  variant: Variant;
  quantity: number;
}
