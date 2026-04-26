import api from './api';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TopSellingProduct {
  name: string;
  quantity: number;
}

export interface AdminStats {
  total_revenue: number;
  monthly_revenue: number;
  total_orders: number;
  monthly_orders: number;
  total_products: number;
  total_users: number;
  low_stock_count: number;
  orders_by_status: Record<string, number>;
  top_selling_products: TopSellingProduct[];
  recent_orders: AdminOrder[];
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  product_count: number;
}

export interface AdminProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  order: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  original_price: string | null;
  category: number;
  category_name: string;
  stock_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  images: AdminProductImage[];
  created_at: string;
}

export interface AdminOrderItem {
  id: number;
  product_name: string;
  product_image: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  customer_email: string;
  customer_name: string;
  shipping_full_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  total: string;
  items: AdminOrderItem[];
  created_at: string;
}

export interface AdminMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role: 'customer' | 'staff' | 'admin';
  order_count: number;
  created_at: string;
}

export const adminAPI = {
  // Stats
  stats: () => api.get<AdminStats>('/admin/stats/'),

  // Categories
  categories: {
    list: () => api.get<AdminCategory[]>('/admin/categories/'),
    create: (data: Partial<AdminCategory>) => api.post('/admin/categories/', data),
    update: (id: number, data: Partial<AdminCategory>) => api.put(`/admin/categories/${id}/`, data),
    delete: (id: number) => api.delete(`/admin/categories/${id}/`),
  },

  // Products
  products: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<AdminProduct>>('/admin/products/', { params }),
    detail: (id: number) => api.get<AdminProduct>(`/admin/products/${id}/`),
    create: (data: FormData | Record<string, unknown>) => api.post('/admin/products/', data),
    update: (id: number, data: FormData | Record<string, unknown>) => api.put(`/admin/products/${id}/`, data),
    delete: (id: number) => api.delete(`/admin/products/${id}/`),
  },

  // Orders
  orders: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<AdminOrder>>('/admin/orders/', { params }),
    detail: (id: number) => api.get<AdminOrder>(`/admin/orders/${id}/`),
    updateStatus: (id: number, status: string) =>
      api.patch(`/admin/orders/${id}/`, { status }),
  },

  // Messages
  messages: {
    list: (params?: Record<string, string>) => api.get<AdminMessage[]>('/admin/messages/', { params }),
    markRead: (id: number, is_read = true) =>
      api.patch(`/admin/messages/${id}/`, { is_read }),
    delete: (id: number) => api.delete(`/admin/messages/${id}/`),
  },

  // Users
  users: {
    list: (params?: Record<string, string>) => api.get<AdminUser[]>('/admin/users/', { params }),
    create: (data: Record<string, unknown>) => api.post('/admin/users/', data),
    update: (id: number, data: Record<string, unknown>) => api.put(`/admin/users/${id}/`, data),
    delete: (id: number) => api.delete(`/admin/users/${id}/`),
  },
};
