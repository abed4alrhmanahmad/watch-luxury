// Shared product type — matches both the API response and the legacy frontend Product interface

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  order: number;
}

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  category_name?: string;
  category_slug?: string;
  category?: string;           // legacy slug field
  description?: string;
  in_stock?: boolean;
  inStock?: boolean;
  stock_count?: number;
  stockCount?: number;
  is_featured?: boolean;
  isFeatured?: boolean;
  is_new?: boolean;
  isNew?: boolean;
  images: string[] | ProductImage[];
  created_at?: string;
}

// Helper — always returns an array of URL strings regardless of image source
export function getImageUrls(product: Product): string[] {
  if (!product.images || product.images.length === 0) return [];
  if (typeof product.images[0] === 'string') return product.images as string[];
  return (product.images as ProductImage[]).map((img) => img.url);
}

export function isInStock(product: Product): boolean {
  return product.in_stock ?? product.inStock ?? (product.stock_count ?? product.stockCount ?? 0) > 0;
}

export function getStockCount(product: Product): number {
  return product.stock_count ?? product.stockCount ?? 0;
}

export function getOriginalPrice(product: Product): number | undefined {
  return product.original_price ?? product.originalPrice;
}
